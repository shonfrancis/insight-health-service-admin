
const fs = require('fs');
const mockData = fs.readFileSync('mock_data.ts', 'utf8');
let content = fs.readFileSync('app/dashboard/patients/page.tsx', 'utf8');

const startStr = '    // Mock Database';
const endStr = '    const [searchQuery, setSearchQuery] = useState(\
\);';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    const newContent = content.substring(0, startIdx) + 
        mockData + '\n    const [patients] = useState<Patient[]>(mockPatientsData);\n\n' + 
        content.substring(endIdx);
    fs.writeFileSync('app/dashboard/patients/page.tsx', newContent, 'utf8');
    console.log('Success');
} else {
    console.log('Failed to find markers.');
}

