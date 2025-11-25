let users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob Williams', email: 'bob@example.com', age: 24 }
];

let nextId = 3;

module.exports = {
    getAll: () => users,
    getById: (id) => users.find(u => u.id === id),
    findByEmail: (email) => users.find(u => u.email === email),
    create: (user) => {
        const newUser = { id: nextId++, ...user };
        users.push(newUser);
        return newUser;
    },
    update: (id, updateData) => {
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return null;
        
        users[index] = { ...users[index], ...updateData };
        return users[index];
    },
    remove: (id) => {
        const initialLength = users.length;
        users = users.filter(u => u.id !== id);
        return users.length < initialLength;
    },
    getList: () => users 
};