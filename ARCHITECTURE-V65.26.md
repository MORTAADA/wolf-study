# White Wolf Scholar V65.26 — Architecture 10 Upgrade

- Domain layer: `domain-model.js`
- Data layer: `repository.js` over the existing persistence contract
- Application layer: `application-services.js`
- Composition/health: `architecture-v2.js`
- Existing Event Bus remains the cross-module communication contract.
- Legacy UI remains intact; the new layers are additive and provide a migration path.
- PWA shell/cache version upgraded to V65.26.

Architecture flow:
UI/Controllers → Application Services → Domain → Repositories → Persistence
                         ↕
                     Event Bus
                         ↕
                 Intelligence Engines
