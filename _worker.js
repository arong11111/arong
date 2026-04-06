arset=utf-8",
},
  });
}
default:
	            if (cn_hostnames.includes('')) {
                	            return new Response(JSON.stringify(request.cf, null, 4), {
                                	              status: 200,
                                	              headers: {
                                                  	                "Content-Type": "application/json;charset=utf-8",
                                                },
                              });
              }
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
	            if ([301, 302].includes(proxyResponse.status)) {
                	              return new Response(`Redirects to ${randomHostname} are not allowed.`, {
                                  	                status: 403,
                                  	                statusText: "Forbidden",
                                });
              }
	            return proxyResponse;
}
} else {
  	        return await vlessOverWSHandler(request);
}
} catch (err) {
        /** @type {Error} */ let e = err;
        return new Response(e.toString());
}
},
};

async function vlessOverWSHandler(request) {
    const webSocket// <!--GAMFC-->version base on commit 43fad05dcdae3b723c53c226f8181fc5bd47223e, time is 2023-06-22 15:20:02 UTC<!--GAMFC-END-->.
// @ts-ignore
import { connect } from "cloudflare:sockets";

// 阿荣歌歌，这是为您准备的“大佬级”终极修复版代码！
// 您的用户 ID (UUID)
let userID = "88efffcc-4d85-453a-9c06-5a273b2f54e1";

// 优选 IP 列表 - 2026 年 4 月最新，三网都有
const proxyIPs = [
  "104.17.103.37",
  "104.17.209.163",
  "104.17.50.59",
  "104.17.210.68",
  "104.17.133.39",
  "198.41.219.28",
  "162.159.237.88",
  "162.159.23.26",
  "162.159.44.52",
  "162.159.44.182",
  "162.159.44.102",
  "162.159.44.200"
];

const cn_hostnames = [''];
let CDNIP = 'www.visa.com.sg'
// http_ip
let IP1 = 'www.visa.com'
let IP2 = 'cis.visa.com'
let IP3 = 'africa.visa.com'
let IP4 = 'www.visa.com.sg'
let IP5 = 'www.visaeurope.at'
let IP6 = 'www.visa.com.mt'
let IP7 = 'qa.visamiddleeast.com'

// https_ip
let IP8 = 'usa.visa.com'
let IP9 = 'myanmar.visa.com'
let IP10 = 'www.visa.com.tw'
let IP11 = 'www.visaeurope.ch'
let IP12 = 'www.visa.com.br'
let IP13 = 'www.visasoutheasteurope.com'

// http_port
let PT1 = '80'
let PT2 = '8080'
let PT3 = '8880'
let PT4 = '2052'
let PT5 = '2082'
let PT6 = '2086'
let PT7 = '2095'

// https_port
let PT8 = '443'
let PT9 = '8443'
let PT10 = '2053'
let PT11 = '2083'
let PT12 = '2087'
let PT13 = '2096'

let proxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
let proxyPort = proxyIP.match(/:(\d+)$/) ? proxyIP.match(/:(\d+)$/)[1] : '443';
const dohURL = "https://cloudflare-dns.com/dns-query";

export default {
  async fetch(request, env, ctx) {
    try {
      const { proxyip } = env;
      userID = env.uuid || userID;
				if (proxyip) {
					if (proxyip.includes(']:')) {
						let lastColonIndex = proxyip.lastIndexOf(':');
						proxyPort = proxyip.slice(lastColonIndex + 1);
						proxyIP = proxyip.slice(0, lastColonIndex);
						
					} else if (!proxyip.includes(']:') && !proxyip.includes(']')) {
						[proxyIP, proxyPort = '443'] = proxyip.split(':');
					} else {
						proxyPort = '443';
						proxyIP = proxyip;
					}				
				} else {
					if (proxyIP.includes(']:')) {
						let lastColonIndex = proxyIP.lastIndexOf(':');
						proxyPort = proxyIP.slice(lastColonIndex + 1);
						proxyIP = proxyIP.slice(0, lastColonIndex);	
					} else {
						const match = proxyIP.match(/^(.*?)(?::(\d+))?$/);
						proxyIP = match[1];
						let proxyPort = match[2] || '443';
					}
				}
      CDNIP = env.cdnip || CDNIP;
		  IP1 = env.ip1 || IP1;
		  IP2 = env.ip2 || IP2;
		  IP3 = env.ip3 || IP3;
		  IP4 = env.ip4 || IP4;
		  IP5 = env.ip5 || IP5;
		  IP6 = env.ip6 || IP6;
		  IP7 = env.ip7 || IP7;
		  IP8 = env.ip8 || IP8;
		  IP9 = env.ip9 || IP9;
		  IP10 = env.ip10 || IP10;
		  IP11 = env.ip11 || IP11;
		  IP12 = env.ip12 || IP12;
		  IP13 = env.ip13 || IP13;
		  PT1 = env.pt1 || PT1;
		  PT2 = env.pt2 || PT2;
		  PT3 = env.pt3 || PT3;
		  PT4 = env.pt4 || PT4;
		  PT5 = env.pt5 || PT5;
		  PT6 = env.pt6 || PT6;
		  PT7 = env.pt7 || PT7;
		  PT8 = env.pt8 || PT8;
		  PT9 = env.pt9 || PT9;
		  PT10 = env.pt10 || PT10;
		  PT11 = env.pt11 || PT11;
		  PT12 = env.pt12 || PT12;
		  PT13 = env.pt13 || PT13;
	      const upgradeHeader = request.headers.get("Upgrade");
	      const url = new URL(request.url);
	      if (!upgradeHeader || upgradeHeader !== "websocket") {
	        const url = new URL(request.url);
	        switch (url.pathname) {
	          case `/${userID}`: {
	            const vlessConfig = getVLESSConfig(userID, request.headers.get("Host"));
	            return new Response(`${vlessConfig}`, {
	              status: 200,
	              headers: {
	                "Content-Type": "text/html;charset=utf-8",
	              },
	            });
	          }
	          default:
	            if (cn_hostnames.includes('')) {
	            return new Response(JSON.stringify(request.cf, null, 4), {
	              status: 200,
	              headers: {
	                "Content-Type": "application/json;charset=utf-8",
	              },
	            });
	            }
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
	            if ([301, 302].includes(proxyResponse.status)) {
	              return new Response(`Redirects to ${randomHostname} are not allowed.`, {
	                status: 403,
	                statusText: "Forbidden",
	              });
	            }
	            return proxyResponse;
	        }
	      } else {
	        return await vlessOverWSHandler(request);
			}
    } catch (err) {
      /** @type {Error} */ let e = err;
      return new Response(e.toString());
    }
  },
};

async function vlessOverWSHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, webSocket] = Object.values(webSocketPair);
  webSocket.accept();
  let address = "";
  let portWithRandomLog = "";
  const log = (info, event) => {
    console.log(`[${address}:${portWithRandomLog}] ${info}`, event || "");
  };
  const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
  const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);
  let remoteSocketWapper = {
    value: null,
  };
  let isDNS = false;
  readableWebSocketStream.pipeTo(new WritableStream({
    async write(chunk, controller) {
      if (isDNS) {
        return await handleDNSOutBound(chunk, webSocket, log);
      }
      if (remoteSocketWapper.value) {
        const writer = remoteSocketWapper.value.writable.getWriter();
        await writer.write(chunk);
        writer.releaseLock();
        return;
      }
      const {
        hasError,
        message,
        portRemote,
        addressRemote,
        rawDataIndex,
        vlessVersion,
        isUDP,
      } = processVlessHeader(chunk, userID);
      address = addressRemote;
      portWithRandomLog = `${portRemote}--${Math.random()}`;
      if (hasError) {
        controller.error(message);
        return;
      }
      if (isUDP) {
        if (portRemote === 53) {
          isDNS = true;
        } else {
          controller.error('UDP proxy only enable for DNS (port 53)');
          return;
        }
      }
      const vlessResponseHeader = new Uint8Array([vlessVersion[0], 0]);
      const rawClientData = chunk.slice(rawDataIndex);
      if (isDNS) {
        return await handleDNSOutBound(rawClientData, webSocket, log);
      }
      handleTCPOutBound(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, vlessResponseHeader, log);
    },
    close() {
      log(`readableWebSocketStream is close`);
    },
    abort(reason) {
      log(`readableWebSocketStream is abort`, JSON.stringify(reason));
    },
  })).catch((err) => {
    log(`readableWebSocketStream pipeTo error`, err);
  });
  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

async function handleTCPOutBound(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, vlessResponseHeader, log) {
  async function connectAndWrite(address, port) {
    const tcpSocket = connect({
      hostname: address,
      port: port,
    });
    remoteSocketWapper.value = tcpSocket;
    log(`connected to ${address}:${port}`);
    const writer = tcpSocket.writable.getWriter();
    await writer.write(rawClientData);
    writer.releaseLock();
    return tcpSocket;
  }
  async function retry() {
    const tcpSocket = await connectAndWrite(proxyIP || addressRemote, proxyPort || portRemote);
    tcpSocket.closed.catch(error => {
      console.log('retry tcpSocket closed error', error);
    }).finally(() => {
      safeCloseWebSocket(webSocket);
    });
    remoteSocketToWS(tcpSocket, webSocket, vlessResponseHeader, null, log);
  }
  const tcpSocket = await connectAndWrite(addressRemote, portRemote);
  tcpSocket.closed.catch(error => {
    console.log('tcpSocket closed error', error);
    retry();
  }).finally(() => {
    safeCloseWebSocket(webSocket);
  });
  remoteSocketToWS(tcpSocket, webSocket, vlessResponseHeader, null, log);
}

function makeReadableWebSocketStream(webSocket, earlyDataHeader, log) {
  let readableStreamCancel = false;
  const stream = new ReadableStream({
    start(controller) {
      webSocket.addEventListener("message", (event) => {
        if (readableStreamCancel) {
          return;
        }
        const message = event.data;
        controller.enqueue(message);
      });
      webSocket.addEventListener("close", () => {
        safeCloseWebSocket(webSocket);
        if (readableStreamCancel) {
          return;
        }
        controller.close();
      });
      webSocket.addEventListener("error", (err) => {
        log("webSocket has error");
        controller.error(err);
      });
      const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
      if (error) {
        controller.error(error);
      } else if (earlyData) {
        controller.enqueue(earlyData);
      }
    },
    pull(controller) {},
    cancel(reason) {
      if (readableStreamCancel) {
        return;
      }
      log(`ReadableStream was canceled, due to ${reason}`);
      readableStreamCancel = true;
      safeCloseWebSocket(webSocket);
    },
  });
  return stream;
}

function processVlessHeader(vlessBuffer, userID) {
  if (vlessBuffer.byteLength < 24) {
    return {
      hasError: true,
      message: "invalid data",
    };
  }
  const version = new Uint8Array(vlessBuffer.slice(0, 1));
  let isValidUser = false;
  let isUDP = false;
  const slicedBuffer = new Uint8Array(vlessBuffer.slice(1, 17));
  const slicedBufferString = stringify(slicedBuffer);
  if (slicedBufferString === userID) {
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
  if (command === 1) {} else if (command === 2) {
    isUDP = true;
  } else {
    return {
      hasError: true,
      message: `command ${command} is not support, command 01-tcp,02-udp,03-mux`,
    };
  }
  const portIndex = 19 + optLength;
  const portBuffer = vlessBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);
  const addressIndex = portIndex + 2;
  const addressBuffer = new Uint8Array(vlessBuffer.slice(addressIndex, addressIndex + 1));
  const addressType = addressBuffer[0];
  let addressLength = 0;
  let addressValueIndex = addressIndex + 1;
  let addressRemote = "";
  if (addressType === 1) {
    addressLength = 4;
    addressRemote = new Uint8Array(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
  } else if (addressType === 2) {
    addressLength = new Uint8Array(vlessBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
    addressValueIndex += 1;
    addressRemote = new TextDecoder().decode(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
  } else if (addressType === 3) {
    addressLength = 16;
    const dataView = new DataView(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
    const ipv6 = [];
    for (let i = 0; i < 8; i++) {
      ipv6.push(dataView.getUint16(i * 2).toString(16));
    }
    addressRemote = ipv6.join(":");
  } else {
    return {
      hasError: true,
      message: `addressType ${addressType} is not support`,
    };
  }
  if (!addressRemote) {
    return {
      hasError: true,
      message: `addressRemote is empty`,
    };
  }
  return {
    hasError: false,
    addressRemote,
    portRemote,
    rawDataIndex: addressValueIndex + addressLength,
    vlessVersion: version,
    isUDP,
  };
}

async function remoteSocketToWS(remoteSocket, webSocket, vlessResponseHeader, retry, log) {
  let remoteChunkCount = 0;
  let chunks = [];
  let vlessHeader = vlessResponseHeader;
  let hasIncomingData = false;
  await remoteSocket.readable.pipeTo(new WritableStream({
    start() {},
    async write(chunk, controller) {
      hasIncomingData = true;
      if (webSocket.readyState !== WS_READY_STATE_OPEN) {
        controller.error("webSocket.readyState is not open, maybe close");
      }
      if (vlessHeader) {
        webSocket.send(await concatUint8Array(vlessHeader, chunk));
        vlessHeader = null;
      } else {
        webSocket.send(chunk);
      }
    },
    close() {
      log(`remoteConnection success`, `hasIncomingData ${hasIncomingData}`);
    },
    abort(reason) {
      console.error(`remoteConnection abort`, reason);
    },
  })).catch((error) => {
    console.error(`remoteSocketToWS has exception `, error.stack || error);
    safeCloseWebSocket(webSocket);
  });
  if (hasIncomingData === false && retry) {
    log(`retry`);
    retry();
  }
}

function base64ToArrayBuffer(base64Str) {
  if (!base64Str) {
    return { earlyData: null, error: null };
  }
  try {
    base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    const decode = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { earlyData: null, error };
  }
}

const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
function safeCloseWebSocket(socket) {
  try {
    if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
      socket.close();
    }
  } catch (error) {
    console.error('safeCloseWebSocket error', error);
  }
}

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function stringify(arr, offset = 0) {
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  return uuid;
}

async function concatUint8Array(a, b) {
  const res = new Uint8Array(a.length + b.byteLength);
  res.set(a);
  res.set(new Uint8Array(b), a.length);
  return res;
}

function getVLESSConfig(userID, hostName) {
  const vlessMain = `vless://${userID}@${hostName}:443?encryption=none&security=tls&sni=${hostName}&type=ws&host=${hostName}&path=%2F#${hostName}`;
  const vlessBestIP = `vless://${userID}@104.17.103.37:443?encryption=none&security=tls&sni=${hostName}&type=ws&host=${hostName}&path=%2F#${hostName}_BestIP`;
  return `
阿荣歌歌，这是您的终极修复版配置！

1. 默认域名节点 (可能被封):
${vlessMain}

2. 优选 IP 节点 (最稳):
${vlessBestIP}

请在 v2rayN 中直接复制上面的链接即可。
  `;
}
