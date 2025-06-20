import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import { UserFacingSocketConfig } from '../Types'
import { makeBusinessSocket } from './business'
import { generateMessageID } from '../Utils/generics' // ajuste o caminho conforme sua estrutura real

export const makeWASocket = (config: UserFacingSocketConfig) => {
  const sock = makeBusinessSocket({
    ...DEFAULT_CONNECTION_CONFIG,
    ...config,
  });

  async function offerCall(jid: string) {
    await sock.sendNode({
      tag: 'call',
      attrs: {
        from: sock.authState.creds.me?.id!,
        to: jid,
        id: generateMessageID(),
      },
      content: [],
    });
  }

  async function terminateCall(jid: string) {
    await sock.sendNode({
      tag: 'call',
      attrs: {
        from: sock.authState.creds.me?.id!,
        to: jid,
        id: generateMessageID(),
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