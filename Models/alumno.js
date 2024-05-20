//propiedades(username, DNIyedad) y también un método toString()que retorne la información del alumno. Instanciarenunprogramaprincipaltresobjetosymostrarlosenlaconsola
export default class Alumno {

    constructor(username='', DNI='' , edad = 0) {
            this.username = username;
            this.DNI = DNI;
            this.edad= edad;
    
    }

    getUsername() {
        return this.username;
    }
    getDNI() {
        return this.DNI;
    }
    getEdad() {
        return this.edad;
    }
    toString(){ return `username:${this.username},DNI:${this.DNI},edad:${this.edad}`; } 
}
    