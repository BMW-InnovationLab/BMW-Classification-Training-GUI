import socket

class UsedPortsService():

    def get_used_ports(self):

        used_ports = []
        for port in range(1,65535):
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            result = sock.connect_ex((socket._LOCALHOST, port))
            if result == 0:
                used_ports.append(str(port))

            sock.close()

        return used_ports 