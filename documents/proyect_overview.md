### What is This Project?

**Users Service** is a scalable TypeScript-based REST API that provides a complete user management system with the following core capabilities:

- **User Management**: Full CRUD operations with secure password handling using bcrypt
- **Role Management**: Hierarchical role system with fine-grained permission control
- **Post Management**: Content management system enabling users to create and manage posts
- **Authentication**: JWT-based authentication for secure API access
- **Authorization**: Role-based access control (RBAC) with permission-level enforcement

The application follows enterprise-grade architectural patterns including the Repository Pattern, Dependency Injection, and layered service-oriented architecture.

### Why Build This?

1. **Production-Ready Foundation**: Provides a complete, battle-tested template for building secure REST APIs with TypeScript
2. **Security First**: Implements industry-standard security practices including bcrypt password hashing and JWT token validation
3. **Scalability**: Decoupled architecture (repositories, services, controllers) enables easy feature expansion and maintenance
4. **Developer Experience**: Comprehensive type safety through TypeScript and modular design for intuitive codebase navigation
5. **Best Practices**: Demonstrates real-world implementation of design patterns commonly used in enterprise applications

### Key Features

- JWT-based authentication and authorization
- Bcrypt password hashing with configurable salt rounds
- Role-based access control (RBAC) with method and scope permissions
- MongoDB integration with Mongoose ODM
- Repository Pattern for data access abstraction
- Dependency Injection for loose coupling and testability
- Comprehensive error handling and validation
- HTTP request logging with Morgan middleware
- Environment-based configuration management
- TypeScript strict mode for maximum type safety

