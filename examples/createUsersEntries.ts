import {writeFileSync} from 'fs';
import {en, es, faker, Faker} from '@faker-js/faker';

const generateCSV = (numEntries: number): string => {
    const headers = [
        'name.firstName',
        'name.lastName',
        'age',
        'address.line1',
        'address.line2',
        'address.city',
        'address.state',
        'gender',
    ];

    const lines = [headers.join(',')];
    const customFaker = new Faker({locale: [es, en]});

    for (let i = 0; i < numEntries; i++) {
        const gender = customFaker.person.sex() as 'female' | 'male';
        const firstName = customFaker.person.firstName(gender);
        const lastName = customFaker.person.lastName(gender);
        const age = faker.number.int({min: 18, max: 80}).toString();
        const addressLine1 = customFaker.location.streetAddress();
        const addressLine2 = customFaker.location.secondaryAddress();
        const city = customFaker.location.city();
        const state = customFaker.location.state();
        const row = [
            firstName,
            lastName,
            age,
            addressLine1,
            addressLine2,
            city,
            state,
            gender,
        ].join(',');

        lines.push(row);
    }

    return lines.join('\n');
};

const numEntries = 5000;
const csvContent = generateCSV(numEntries);

writeFileSync('examples/generated_data.csv', csvContent);
console.log(`Generated ${numEntries} entries and saved to generated_data.csv`);
