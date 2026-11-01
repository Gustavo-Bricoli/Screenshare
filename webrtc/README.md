# WebRTC/SFU

A documentação principal do projeto está em [`../README.md`](../README.md).

Esta pasta contém a implementação atual:

- `src/`: aplicação React, viewer e publicador pelo navegador.
- `server.mjs`: API Express para health check e emissão de tokens.
- `publisher.py`: publicador Python de tela e áudio do sistema.
- `docker-compose.yml`, `Dockerfile`, `Dockerfile.publisher` e `livekit.yaml`:
  infraestrutura local em containers.
- `vite.config.js`: servidor de desenvolvimento e proxy da API.

Consulte o README da raiz para requisitos, arquitetura, configuração, comandos de
execução e limitações conhecidas.

Para iniciar a interface, a API e o LiveKit de uma vez:

```powershell
docker compose up --build
```

O publicador Python também possui uma imagem, mas fica em um profile separado:

```powershell
docker compose --profile python-publisher up --build
```

Esse profile só funciona quando o container tem acesso à tela e ao dispositivo de
áudio do host. No Docker Desktop para Windows, a captura da tela e do áudio do
Windows não é exposta automaticamente ao container; nesse ambiente, use o
publicador pelo navegador ou execute `publisher.py` diretamente no Windows.
