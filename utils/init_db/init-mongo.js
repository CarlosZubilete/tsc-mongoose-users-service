// Switch to admin database
db = db.getSiblingDB("admin");

// Create application user (optional, root already exists)
db.createUser({
    user: "test_user",
    pwd: "123456",
    roles: [{ role: "readWrite", db: "users_service_db" }],
});

// Switch to your app database
db = db.getSiblingDB("users_service_db");

// Create collection with initial data
db.createCollection("roles");

// Insert initial data into the collection
db.roles.insertMany([
    {
        name: "root",
        permissions: ["root_access"],
        level: 100,
    },
    {
        name: "admin",
        permissions: [
            "roles_write",
            "roles_read",
            "roles_update",
            "users_write",
            "users_read",
            "users_update",
            "users_delete",
            "posts_read",
            "posts_write",
            "posts_update",
            "posts_delete",
        ],
        level: 80,
    },
    {
        name: "manager",
        permissions: [
            "roles_read",
            "users_write",
            "users_read",
            "users_update", // Maybe this functions is only admin 
            "posts_read",
            "posts_write",
            "posts_update",
            "posts_delete",
        ],
        level: 60,
    },
    {
        name: "user",
        permissions: [
            "users_update", // Allow users to update their own profile
            "posts_read",
            "posts_write",
            "posts_update",
            "posts_delete",
        ],
        level: 40,
    },
    {
        name: "guest",
        permissions: ["posts_read"],
        level: 20,
    },
]);
