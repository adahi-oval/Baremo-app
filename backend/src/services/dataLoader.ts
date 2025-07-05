import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { User } from '../models/User';
import { Article } from '../models/merits/Article';
import { Book } from '../models/merits/Book';
import { Conference } from '../models/merits/Conference';

async function processFile(filename: string, type: 'article' | 'capitulo' | 'libro' | 'conference') {
  return new Promise<void>((resolve, reject) => {
    const filePath = path.join(__dirname, `../../data/${filename}`);

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',', skipLines: 0, headers: ['Number', 'Nombre', 'Apellidos', 'Area', 'Num_Publicaciones', 'Publicacion', 'Extra'] }))
      .on('data', async (row) => {
        const nombre = row['Nombre']?.trim();
        const apellidos = row['Apellidos']?.trim();
        const publicacion = row['Publicacion']?.trim();

        if (!nombre || !apellidos || !publicacion) {
          console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
          return;
        }

        const fullName = `${nombre} ${apellidos}`;
        try {
          const user = await User.findOne({ fullName });
          if (!user) {
            console.warn(`User not found for fullName: ${fullName}`);
            return;
          }

          switch (type) {
            case 'article':
              await new Article({
                title: publicacion,
                user: user,
              }).save();
              break;

            case 'capitulo':
              await new Book({
                title: publicacion,
                user: user,
                bookType: 'Capítulo de libro',
              }).save();
              break;

            case 'libro':
              await new Book({
                title: publicacion,
                user: user,
                bookType: 'Libro',
              }).save();
              break;

            case 'conference':
              await new Conference({
                title: publicacion,
                user: user,
              }).save();
              break;
          }

          console.log(`Created ${type} for ${fullName}`);
        } catch (err) {
          console.error(`Error processing row for ${fullName}:`, err);
        }
      })
      .on('end', () => {
        console.log(`Finished processing ${filename}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error reading file ${filename}:`, err);
        reject(err);
      });
  });
}

export async function dataLoader() {
  console.log('Starting data loading process...');

  await processFile('articulos.csv', 'article');
  await processFile('capitulos.csv', 'capitulo');
  await processFile('conferencias.csv', 'conference');
  await processFile('libros.csv', 'libro');

  console.log('Data loading complete.');
}
