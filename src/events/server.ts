export default function createConnection(server) {
    const { name, description, ip, port } = server
    console.log(name + description)
    this.connection = new WebSocket(`ws://${ip}:${port}`)
}
