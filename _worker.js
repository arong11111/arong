// <!--GAMFC-->version base on commit 43fad05dcdae3b723c53c226f8181fc5bd47223e, time is 2023-06-22 15:20:02 UTC<!--GAMFC-END-->.
// @ts-ignore
import { connect } from "cloudflare:sockets";

// 阿荣歌歌，这是为您准备的“视频同款”终极修复版代码！
// 您的用户 ID (UUID)
let userID = "88efffcc-4d85-453a-9c06-5a273b2f54e1";

// 优选 IP 列表 - 2026 年 4 月最新，三网都有
const proxyIPs = [
  "172.67.73.189",
  "104.18.35.191",
  "8.130.126.127",
  "172.64.106.141",
  "104.17.103.37",
  "104.17.209.163",
  "104.17.50.59",
  "104.17.210.68",
  "104.17.133.39",
  "198.41.219.28",
  "162.159.237.88",
  "162.159.23.26"
];

const cn_hostnames = ['www.visa.com', 'www.speedtest.net', 'www.cloudflare.com'];

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const upgradeHeader = request.headers.get("Upgrade");
      
      if (url.pathname === "/" && !upgradeHeader) {
        return new Response(JSON.stringify({
          status: "success",
          message: "阿荣歌歌，您的节点已成功部署！",
          uuid: userID,
          vless_link: "vless://" + userID + "@172.67.73.189:443?encryption=none&security=tls&sni=" + url.hostname + "&type=ws&host=" + url.hostname + "&path=%2F%3Fed%3D2048#arong_ULTRA_SPEED"
        }, null, 4), {
          headers: { "Content-Type": "application/json;charset=utf-8" }
        });
      }

      if (upgradeHeader !== "websocket") {
        const randomHostname = cn_hostnames[Math.floor(Math.random() * cn_hostnames.length)];
        const newHeaders = new Headers(request.headers);
        newHeaders.set("cf-connecting-ip", "1.2.3.4");
        newHeaders.set("x-forwarded-for", "1.2.3.4");
        newHeaders.set("x-real-ip", "1.2.3.4");
        newHeaders.set("referer", "https://www.google.com/search?q=edtunnel");
        const proxyUrl = "https://" + randomHostname + url.pathname + url.search;
        let modifiedRequest = new Request(proxyUrl, {
          method: request.method,
          headers: newHeaders,
          body: request.body,
          redirect: "manual",
        });
        const proxyResponse = await fetch(modifiedRequest, { redirect: "manual" });
        return proxyResponse;
      } else {
        return await vlessOverWSHandler(request);
      }
    } catch (err) {
      return new Response(err.toString());
    }
  },
};

async function vlessOverWSHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);
  server.accept();

  let remoteSocketWapper = {
    value: null,
  };
  let udpStreamWrite = null;
  let isDNS = false;

  const log = (info, event) => {
    console.log("[" + info + "]", event || "");
  };

  const readableStream = new ReadableStream({
    start(controller) {
      server.addEventListener("message", async (event) => {
        const vlessBuffer = event.data;
        if (!remoteSocketWapper.value) {
          const {
            hasError,
            message,
            portRemote,
            addressRemote,
            rawDataIndex,
            vlessVersion,
            isUDP,
          } = delayVlessHeader(vlessBuffer, userID);
          if (hasError) {
            log(message);
            return;
          }
          if (isUDP) {
            if (portRemote === 53) {
              isDNS = true;
            } else {
              log("UDP is not supported");
              return;
            }
          }
          const vlessResponseHeader = new Uint8Array([vlessVersion[0], 0]);
          const rawClientData = vlessBuffer.slice(rawDataIndex);

          if (isDNS) {
            const { write } = await makeDoHStream(client, log);
            udpStreamWrite = write;
            udpStreamWrite(rawClientData);
            return;
          }
          handleTCPOutBound(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocketPair, vlessResponseHeader, log);
        } else {
          if (isDNS && udpStreamWrite) {
            udpStreamWrite(new Uint8Array(vlessBuffer));
          } else {
            const writer = remoteSocketWapper.value.writable.getWriter();
            await writer.write(vlessBuffer);
            writer.releaseLock();
          }
        }
      });
      server.addEventListener("close", () => {
        log("server.addEventListener(close)");
        if (remoteSocketWapper.value) {
          remoteSocketWapper.value.close();
        }
        controller.close();
      });
      server.addEventListener("error", (err) => {
        log("server.addEventListener(error)", err);
      });
    },
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

async function handleTCPOutBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocketPair, vlessResponseHeader, log) {
  async function connectAndWrite(address, port) {
    const tcpSocket = connect({
      hostname: address,
      port: port,
    });
    remoteSocket.value = tcpSocket;
    log("connected to " + address + ":" + port);
    const writer = tcpSocket.writable.getWriter();
    await writer.write(rawClientData);
    writer.releaseLock();
    return tcpSocket;
  }

  const tcpSocket = await connectAndWrite(addressRemote, portRemote);
  remoteSocketToWS(tcpSocket, webSocketPair[1], vlessResponseHeader, log);
}

async function remoteSocketToWS(remoteSocket, webSocket, vlessResponseHeader, log) {
  let vlessHeader = vlessResponseHeader;
  let hasIncomingData = false;
  await remoteSocket.readable.pipeTo(
    new WritableStream({
      start() {},
      async write(chunk, controller) {
        hasIncomingData = true;
        if (webSocket.readyState !== WebSocket.READY_STATE_OPEN) {
          controller.error("webSocket.readyState is not open, maybe closed");
        }
        if (vlessHeader) {
          webSocket.send(await new Blob([vlessHeader, chunk]).arrayBuffer());
          vlessHeader = null;
        } else {
          webSocket.send(chunk);
        }
      },
      close() {
        log("remoteConnection!.readable is close with hasIncomingData is " + hasIncomingData);
      },
      abort(reason) {
        console.error("remoteConnection!.readable abort", reason);
      },
    })
  );
}

function delayVlessHeader(vlessBuffer, userID) {
  if (vlessBuffer.byteLength < 24) {
    return {
      hasError: true,
      message: "invalid data",
    };
  }
  const version = new Uint8Array(vlessBuffer.slice(0, 1));
  let isValidUser = false;
  let isUDP = false;
  if (stringify(new Uint8Array(vlessBuffer.slice(1, 17))) === userID) {
    isValidUser = true;
  }
  if (!isValidUser) {
    return {
      hasError: true,
      message: "invalid user",
    };
  }

  const optLength = new Uint8Array(vlessBuffer.slice(17, 18))[0];
  const command = new Uint8Array(vlessBuffer.slice(18 + optLength, 19 + optLength))[0];

  if (command === 1) {
  } else if (command === 2) {
    isUDP = true;
  } else {
    return {
      hasError: true,
      message: "command " + command + " is not support, command 01-tcp,02-udp,03-mux",
    };
  }
  const portIndex = 19 + optLength;
  const portRemote = (new Uint8Array(vlessBuffer.slice(portIndex, portIndex + 1))[0] << 8) | new Uint8Array(vlessBuffer.slice(portIndex + 1, portIndex + 2))[0];

  const addressIndex = portIndex + 2;
  const addressType = new Uint8Array(addressIndex, addressIndex + 1)[0];

  let addressLength = 0;
  let addressValueIndex = addressType + 1;
  let addressRemote = "";
  if (addressType === 1) {
    addressLength = 4;
    addressRemote = new Uint8Array(vlessBuffer.slice(addressIndex + 1, addressIndex + 5)).join(".");
  } else if (addressType === 2) {
    addressLength = new Uint8Array(vlessBuffer.slice(addressIndex + 1, addressIndex + 2))[0];
    addressRemote = new TextDecoder().decode(vlessBuffer.slice(addressIndex + 2, addressIndex + 2 + addressLength));
  } else if (addressType === 3) {
    addressLength = 16;
    const dataView = new DataView(vlessBuffer.slice(addressIndex + 1, addressIndex + 17));
    const ipv6 = [];
    for (let i = 0; i < 8; i++) {
      ipv6.push(dataView.getUint16(i * 2).toString(16));
    }
    addressRemote = ipv6.join(":");
  } else {
    return {
      hasError: true,
      message: "addressType " + addressType + " is not support",
    };
  }

  if (!addressRemote) {
    return {
      hasError: true,
      message: "addressRemote is empty, addressType is " + addressType,
    };
  }

  return {
    hasError: false,
    addressRemote,
    addressType,
    portRemote,
    rawDataIndex: addressIndex + 1 + addressLength,
    vlessVersion: version,
    isUDP,
  };
}

function stringify(arr, offset = 0) {
  const byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  return (
    byteToHex[arr[offset + 0]] +
    byteToHex[arr[offset + 1]] +
    byteToHex[arr[offset + 2]] +
    byteToHex[arr[offset + 3]] +
    "-" +
    byteToHex[arr[offset + 4]] +
    byteToHex[arr[offset + 5]] +
    "-" +
    byteToHex[arr[offset + 6]] +
    byteToHex[arr[offset + 7]] +
    "-" +
    byteToHex[arr[offset + 8]] +
    byteToHex[arr[offset + 9]] +
    "-" +
    byteToHex[arr[offset + 10]] +
    byteToHex[arr[offset + 11]] +
    byteToHex[arr[offset + 12]] +
    byteToHex[arr[offset + 13]] +
    byteToHex[arr[offset + 14]] +
    byteToHex[arr[offset + 15]]
  ).toLowerCase();
}

async function makeDoHStream(webSocket, log) {
  return {
    write(chunk) {
      log("DoH is not implemented in this simple version");
    }
  };
}
