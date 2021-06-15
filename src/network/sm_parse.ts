export default function smParser(packet: string){
    const split_packet = packet.split('#')
    split_packet.shift()
    return split_packet
}