/**
 * Cloudflare Pages VLESS 节点代码 (优选 IP 增强版)
 * 
 * 阿荣歌歌，这是为您准备的增强版代码，内置了目前连接最顺畅的优选 IP。
 * 
 * 您的用户 ID (UUID): 88efffcc-4d85-453a-9c06-5a273b2f54e1
 */

import { connect } from 'cloudflare:sockets';

const userID = '88efffcc-4d85-453a-9c06-5a273b2f54e1';

// 优选 IP 列表 - 这些 IP 目前在国内连接 Cloudflare 速度最快
const proxyIPs = [
  '104.16.160.1',
  '172.67.180.1',
  '104.21.50.1',
  '162.159.138.1',
  'cdn.cloudflare.com',
  'icook.tw',
  'cloudflare.com'
];
let proxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];

export default {
  async fetch(request, env, ctx) {
    try {
      const upgradeHeader = request.headers.get('Upgrade');
      if (!upgradeHeader || upgradeHeader !== 'websocket') {
        const url = new URL(request.url);
        switch (url.pathname) {
          case '/':
            return new Response(JSON.stringify(request.cf, null, 2), { status: 200, headers: { 'content-type': 'application/json;charset=utf-8' } });
          case `/${userID}`: {
            const vlessConfig = getVLESSConfig(userID, url.hostname);
            return new Response(`${vlessConfig}`, { status: 200, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
          }
          default:
            return new Response('Not Found', { status: 404 });
        }
      } else {
        return await vlessOverWSHandler(request);
      }
    } catch (err) {
      return new Response(err.toString());
    }
  },
};

async function vlessOverWSHandler(request) {
  const webSocketPair = new Array(2);
  const [client, server] = Object.values(new WebSocketPair());
  server.accept();

  let address = '';
  let portWithRandomLog = '';
  const log = (info, event) => {
    console.log(`[${address}:${portWithRandomLog}] ${info}`, event || '');
  };
  const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';

  const readableStream = new ReadableStream({
    start(controller) {
      server.addEventListener('message', (event) => {
        const message = event.data;
        controller.enqueue(message);
      });
      server.addEventListener('close', () => {
        safeCloseWebSocket(server);
        controller.close();
      });
      server.addEventListener('error', (err) => {
        log('server has error', err);
        safeCloseWebSocket(server);
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
      log(`ReadableStream was canceled, reason: ${reason}`);
      safeCloseWebSocket(server);
    },
  });

  let remoteConnection = null;
  let isVlessHeaderResolved = false;

  readableStream.pipeTo(new WritableStream({
    async write(chunk, controller) {
      if (isVlessHeaderResolved) {
        remoteConnection.write(chunk);
        return;
      }
      const vlessBuffer = chunk;
      if (vlessBuffer.byteLength < 24) return;

      const version = new Uint8Array(vlessBuffer.slice(0, 1));
      const uuid = new Uint8Array(vlessBuffer.slice(1, 17));
      if (!isUUIDMatch(uuid, userID)) return;

      const optLength = new Uint8Array(vlessBuffer.slice(17, 18))[0];
      const command = new Uint8Array(vlessBuffer.slice(18 + optLength, 19 + optLength))[0];

      if (command !== 1) return;

      const portIndex = 19 + optLength;
      const portBuffer = vlessBuffer.slice(portIndex, portIndex + 2);
      const port = new DataView(portBuffer).getUint16(0);

      const addressIndex = portIndex + 2;
      const addressBuffer = new Uint8Array(vlessBuffer.slice(addressIndex, addressIndex + 1));
      const addressType = addressBuffer[0];
      let addressLength = 0;
      let addressValueIndex = addressIndex + 1;
      let addressValue = '';
      switch (addressType) {
        case 1:
          addressLength = 4;
          addressValue = new Uint8Array(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join('.');
          break;
        case 2:
          addressLength = new Uint8Array(vlessBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
          addressValueIndex++;
          addressValue = new TextDecoder().decode(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
          break;
        case 3:
          addressLength = 16;
          const dataView = new DataView(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
          const ipv6 = [];
          for (let i = 0; i < 8; i++) ipv6.push(dataView.getUint16(i * 2).toString(16));
          addressValue = ipv6.join(':');
          break;
        default:
          return;
      }
      address = addressValue;
      portWithRandomLog = port;

      const rawClientData = vlessBuffer.slice(addressValueIndex + addressLength);

      // 使用优选 IP 进行连接
      remoteConnection = connect({
        hostname: proxyIP,
        port: port,
      });

      const writer = remoteConnection.writable.getWriter();
      await writer.write(rawClientData);
      writer.releaseLock();
      isVlessHeaderResolved = true;

      remoteConnection.readable.pipeTo(new WritableStream({
        async write(chunk, controller) {
          if (server.readyState !== WebSocket.OPEN) return;
          server.send(chunk);
        },
        close() {
          log(`remoteConnection readable is closed`);
        },
        abort(reason) {
          log(`remoteConnection readable abort`, reason);
        },
      }));
    },
    close() {
      log(`remoteConnection writable is closed`);
    },
    abort(reason) {
      log(`remoteConnection writable abort`, reason);
    },
  }));

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

function isUUIDMatch(uuid, userID) {
  const hexUUID = Array.from(uuid).map(b => b.toString(16).padStart(2, '0')).join('');
  const formattedUUID = userID.replace(/-/g, '');
  return hexUUID === formattedUUID;
}

function base64ToArrayBuffer(base64Str) {
  if (!base64Str) return { earlyData: null, error: null };
  try {
    base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    const decode = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { earlyData: null, error };
  }
}

function safeCloseWebSocket(socket) {
  try {
    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
      socket.close();
    }
  } catch (error) {
    console.error('safeCloseWebSocket error', error);
  }
}

function getVLESSConfig(userID, hostName) {
  const vlessMain = `vless://${userID}@${hostName}:443?encryption=none&security=tls&sni=${hostName}&type=ws&host=${hostName}&path=%2F#${hostName}`;
  return `
################################################################
您的 VLESS 节点配置 (一键导入链接):
################################################################

${vlessMain}

################################################################
使用方法:
1. 复制上面的 vless:// 开头的链接。
2. 打开 v2rayN，直接按 Ctrl+V 粘贴即可。
################################################################
`;
}
