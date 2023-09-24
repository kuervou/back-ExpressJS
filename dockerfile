# Selecciona una imagen base de Node
FROM node:18

# Directorio en el cual se colocarán los archivos
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto que utiliza tu aplicación
EXPOSE 3000

# Comando para iniciar la aplicación 
CMD ["node", "src/app.js"]  

#dev CMD ["node", "src/app.js"]  
#test  CMD ["npm", "test"]