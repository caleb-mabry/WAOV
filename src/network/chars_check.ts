export default function charsCheckParser(packet: string) {
    const split_packet = packet.split('#')
    split_packet.shift()
    split_packet.pop()
    return split_packet
}