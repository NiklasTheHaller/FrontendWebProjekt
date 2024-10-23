// userStore.js
import { ref } from 'vue';

const users = ref([
    { email: 'jon@gmail.com', password: 'password', role: 'user', id: 1 },
    { email: 'jack@gmail.com', password: 'hello123', role: 'admin', id: 2 },
]);

export const useUserStore = () => {
    const getUserByEmail = (email) => {
        return users.value.find(user => user.email === email);
    };

    const addUser = (email, password, role) => {
        const id = users.value.length + 1; // Simple ID assignment
        users.value.push({ email, password, role, id });
    };

    return {
        users,
        getUserByEmail,
        addUser,
    };
};
