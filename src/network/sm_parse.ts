export default function smParser(packet: string){
    const split_packet = packet.split('#')
    split_packet.unshift()
    split_packet.pop()

    return split_packet
}