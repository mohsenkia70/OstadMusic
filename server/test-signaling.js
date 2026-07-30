const WebSocket = require("ws");

const URL = "ws://localhost:4001";
const roomId = "test-room-1";

function connect(name, role, peerId) {
  return new Promise((resolve) => {
    const ws = new WebSocket(URL);
    const received = [];
    ws.on("open", () => {
      ws.send(JSON.stringify({ type: "join", roomId, peerId, name, role }));
      resolve({ ws, received });
    });
    ws.on("message", (raw) => {
      const msg = JSON.parse(raw.toString());
      received.push(msg);
      console.log(`[${name}] received:`, JSON.stringify(msg));
    });
  });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

let failures = 0;
function assert(cond, label) {
  if (cond) {
    console.log(`PASS: ${label}`);
  } else {
    console.log(`FAIL: ${label}`);
    failures++;
  }
}

async function run() {
  console.log("--- teacher joins ---");
  const teacher = await connect("نگار احمدی", "teacher", "peer-teacher");
  await wait(200);

  console.log("--- student joins ---");
  const student = await connect("مهسا رستمی", "student", "peer-student");
  await wait(300);

  // Teacher should have received a peer-joined event for the student
  assert(
    teacher.received.some((m) => m.type === "peer-joined" && m.peerId === "peer-student"),
    "teacher notified when student joins"
  );

  // Student should have received room-state including the teacher
  const roomStateMsg = student.received.find((m) => m.type === "room-state");
  assert(
    Boolean(roomStateMsg) && roomStateMsg.participants.some((p) => p.peerId === "peer-teacher"),
    "student receives room-state including teacher"
  );

  // --- signaling relay (offer/answer) ---
  student.received.length = 0;
  teacher.ws.send(
    JSON.stringify({
      type: "signal",
      targetPeerId: "peer-student",
      data: { kind: "offer", sdp: "fake-sdp-offer" },
    })
  );
  await wait(200);
  const sig = student.received.find((m) => m.type === "signal");
  assert(
    Boolean(sig) && sig.fromPeerId === "peer-teacher" && sig.data.kind === "offer",
    "WebRTC offer relayed from teacher to student"
  );

  // --- chat relay ---
  teacher.received.length = 0;
  student.ws.send(JSON.stringify({ type: "chat", name: "مهسا رستمی", text: "سلام استاد" }));
  await wait(200);
  const chatMsg = teacher.received.find((m) => m.type === "chat");
  assert(Boolean(chatMsg) && chatMsg.text === "سلام استاد", "chat message relayed to teacher");

  // --- whiteboard relay ---
  student.received.length = 0;
  teacher.ws.send(
    JSON.stringify({ type: "whiteboard", event: { x: 10, y: 20, type: "draw" } })
  );
  await wait(200);
  const wbMsg = student.received.find((m) => m.type === "whiteboard");
  assert(Boolean(wbMsg) && wbMsg.event.x === 10, "whiteboard event relayed to student");

  // --- host control: mute ---
  student.received.length = 0;
  teacher.ws.send(
    JSON.stringify({ type: "host-control", action: "mute", targetPeerId: "peer-student" })
  );
  await wait(200);
  const muteMsg = student.received.find((m) => m.type === "host-control");
  assert(Boolean(muteMsg) && muteMsg.action === "mute", "host mute control delivered to student");

  // --- media-state broadcast ---
  teacher.received.length = 0;
  student.ws.send(JSON.stringify({ type: "media-state", muted: true, camOff: false }));
  await wait(200);
  const mediaMsg = teacher.received.find((m) => m.type === "media-state");
  assert(Boolean(mediaMsg) && mediaMsg.muted === true, "media-state broadcast reaches teacher");

  // --- leave / disconnect notification ---
  teacher.received.length = 0;
  student.ws.close();
  await wait(300);
  const leftMsg = teacher.received.find((m) => m.type === "peer-left");
  assert(Boolean(leftMsg) && leftMsg.peerId === "peer-student", "teacher notified when student leaves");

  teacher.ws.close();
  await wait(200);

  console.log(`\n${failures === 0 ? "ALL TESTS PASSED" : failures + " TEST(S) FAILED"}`);
  process.exit(failures === 0 ? 0 : 1);
}

run();
