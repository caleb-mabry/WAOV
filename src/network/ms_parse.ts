export default function masterServerParser(master_server_packet: string) {
    const split_packet = master_server_packet.split('#')

    // Remove MS and %
    split_packet.shift()
    split_packet.unshift()

    // Parse the packet
    const deskMod = split_packet[0]
    const preanim = split_packet[1]
    const character = split_packet[2]
    const emote = split_packet[3]
    const message = split_packet[4]
    const side = split_packet[5]
    const sfxName = split_packet[6]
    const emoteModifier = split_packet[7]
    const charId = split_packet[8]
    const sfxDelay = split_packet[9]
    const shoutModifier = split_packet[10]
    const evidence = split_packet[11]
    const flip = split_packet[12]
    const realization = split_packet[13]
    const textColor = split_packet[14]
    const showname = split_packet[15]
    const otherCharId = split_packet[16]
    const selfOffset = split_packet[17]
    const noninterruptingPreanim = split_packet[18]
    const sfxLooping = split_packet[19]
    const screenshake = split_packet[20]
    const framesShake = split_packet[21]
    const framesRealization = split_packet[22]
    const framesSfx = split_packet[23]
    const additive = split_packet[24]
    const effect = split_packet[25]
    return {
        deskMod, preanim, character, emote, message, side,
        sfxName, emoteModifier, charId, sfxDelay, shoutModifier, evidence,
        flip, realization, textColor, showname, otherCharId,
        selfOffset, noninterruptingPreanim, sfxLooping, screenshake, framesShake,
        framesRealization, framesSfx, additive, effect
    }
}