import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { User } from '../models/User';

export async function userLoader() {
  const filePath = path.join(__dirname, '../../data/investigadores.csv');

  return new Promise<void>((resolve, reject) => {
    const usersCreated: string[] = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',', skipLines: 0, headers: ['Nombre completo', 'area', 'Email', 'ID'] }))
      .on('data', async (row) => {
        const fullName = row['Nombre completo']?.trim();
        const email = row['Email']?.trim();
        const researcherId = Number(row['ID']);

        if (!fullName || !email || isNaN(researcherId)) {
          console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
          return;
        }

        try {
          const exists = await User.findOne({ researcherId });
          if (exists) {
            console.log(`User with researcherId ${researcherId} already exists. Skipping.`);
            return;
          }

          const newUser = new User({
            fullName,
            email,
            researcherId,
            password: '1234',
            institutes: ["IUEM"],
            role: 'user',
          });

          await newUser.save();
          usersCreated.push(fullName);
          console.log(`Created user: ${fullName}`);
        } catch (err) {
          console.error(`Error creating user ${fullName}:`, err);
          if (err instanceof Error) {
            throw new Error(err.message)
          }
        }
      })
      .on('end', () => {
        console.log(`Finished processing. ${usersCreated.length} users created.`);
        resolve();
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        reject(err);
      });
  });
}
