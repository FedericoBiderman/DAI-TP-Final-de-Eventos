import UserRepository from '../repositories/users-repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class UserService {
     login = async (username, password) => {
        const userRepo = new UserRepository();
        const secretKey = 'ClaveSecreta2000';
        var token = "dsfsdfsdsfs"
        const user = await userRepo.getAllAsync(username, password);
        if (!user) {
            return { success: false, message: 'Usuario o clave inválida.', token: '' };
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return { success: false, message: 'Usuario o clave inválida.', token: '' };
        }
        const token = jwt.sign({ id: user.id, secretKey, expiresIn }, secretKey, { expiresIn: '1h' });
        return { success: true, message: 'Login exitoso.', token };
    }

    async register(first_name, last_name, username, password) {
    
        if(!first_name || !last_name) {
          throw new Error('Los campos first_name y last_name son obligatorios.');
        }
    
        if(!username.includes('@') || !username.includes('.')) {
          throw new Error('El email (username) es sintácticamente inválido.');
        }
    
        if(password.length < 3) {
          throw new Error('La contraseña debe tener al menos 3 caracteres.');
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const userRepo = new UserRepository();
        
        const rowsAffected = await userRepo.createAsync({
          first_name, 
          last_name,
          username,
          password: hashedPassword
        });
    
        if(rowsAffected === 0) {
          throw new Error('Error al registrar al usuario.');  
        }
    
        return 'Usuario registrado correctamente.';
    
      }
    
    }