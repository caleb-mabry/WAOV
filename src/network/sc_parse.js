export default function scParser(packet) {
    const split_packet = packet.split('#')
    split_packet.shift()
    split_packet.pop()
    return split_packet
}