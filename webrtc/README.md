# WebRTC/SFU

A documentação principal do projeto está em [`../README.md`](../README.md).

Esta pasta contém a implementação atual:

- `src/`: aplicação React, viewer e publicador pelo navegador.
- `server.mjs`: API Express para health check e emissão de tokens.
- `publisher.py`: publicador Python de tela e áudio do sistema.
- `docker-compose.yml` e `livekit.yaml`: LiveKit local.
- `vite.config.js`: servidor de desenvolvimento e proxy da API.

Consulte o README da raiz para requisitos, arquitetura, configuração, comandos de
execução e limitações conhecidas.