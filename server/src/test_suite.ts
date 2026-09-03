import { emailService } from './services/emailService';
import { apiKeyService } from './services/apiKeyService';
import { templateService } from './services/templateService';

async function runTests() {
  console.log('--- 🧪 STARTING PIXORA EMAIL SERVICE VERIFICATION ---');

  // 1. Test template rendering
  console.log('1. Testing template rendering...');
  const rendered = templateService.renderTemplate('appointment-booking', {
    clinicName: 'Test Dental Clinic',
    patientName: 'John Doe',
    patientPhone: '+91 9999999999',
    patientEmail: 'john@example.com',
    preferredDate: '2026-09-12',
    preferredTime: '10:00 AM',
    treatmentRequired: 'Routine Checkup',
    additionalNotes: 'Test booking notes',
  });
  console.log('   Template subject:', rendered.subject);
  console.log('   Template HTML length:', rendered.html.length);

  // 2. Test API Key creation & validation
  console.log('\n2. Testing API Key Service...');
  const { apiKey, rawKey } = apiKeyService.createApiKey({
    name: 'Test Dental App Key',
    description: 'Unit test key',
  });
  console.log('   Generated Raw Key:', rawKey.substring(0, 15) + '...');
  const validated = apiKeyService.validateKey(rawKey);
  console.log('   Key Validation Result:', validated?.name === 'Test Dental App Key' ? 'SUCCESS' : 'FAILED');

  // 3. Test Provider Fallback Send Engine
  console.log('\n3. Testing Provider Dispatch & Fallback...');
  const sendRes = await emailService.sendEmail({
    to: 'hello@pixorastudios.com',
    template: 'appointment-booking',
    data: {
      clinicName: 'Pixora Test Center',
      patientName: 'Test Patient',
      patientPhone: '1234567890',
      patientEmail: 'hello@pixorastudios.com',
      preferredDate: '2026-09-05',
      preferredTime: '02:00 PM',
      treatmentRequired: 'System Test',
      additionalNotes: 'Automated test dispatch from test suite',
    },
    apiKeyId: apiKey.id,
    apiKeyName: apiKey.name,
  });

  console.log('   Dispatch Response:', sendRes);
  console.log('\n--- ✅ ALL VERIFICATION STEPS COMPLETE ---');
}

runTests().catch(console.error);
