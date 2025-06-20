import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import { UserFacingSocketConfig } from '../Types'
import { makeBusinessSocket } from './business'
import { generateMessageID } from '../Utils/generics'

export const makeWASocket = (config: UserFacingSocketConfig) => {
  const sock = makeBusinessSocket({
    ...DEFAULT_CONNECTION_CONFIG,
    ...config,
  });

  async function offerCall(jid: string, isVideo = false) {
    const callInfo = {
      id: generateMessageID(),
      to: jid
    }

    await sock.sendNode({
      tag: 'call',
      attrs: {
        from: sock.authState.creds.me?.id!,
        to: callInfo.to,
        id: callInfo.id,
        video: isVideo ? 'true' : 'false', // opcional
      },
      content: [],
    });

    return callInfo;
  }

  async function terminateCall(id: string, to: string) {
    await sock.sendNode({
      tag: 'call',
      attrs: {
        from: sock.authState.creds.me?.id!,
        to,
        id,
        type: 'terminate',
      },
      content: [],
    });
  }

  return {
    ...sock,
    offerCall,
    terminateCall,
  }
}

export default makeWASocket