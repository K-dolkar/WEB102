require('dotenv').config();
const supabase = require('./src/lib/supabase');

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...\n');

  // Test 1: Check credentials
  console.log('1. Checking environment variables:');
  console.log('   ✓ SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('   ✓ SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing');
  console.log('   ✓ SUPABASE_PUBLIC_KEY:', process.env.SUPABASE_PUBLIC_KEY ? '✅ Set' : '❌ Missing');

  // Test 2: Check if can connect to Supabase
  console.log('\n2. Testing Supabase connection:');
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log('   ❌ Connection failed:', error.message);
      return;
    }
    console.log('   ✅ Connected to Supabase');
  } catch (err) {
    console.log('   ❌ Error:', err.message);
    return;
  }

  // Test 3: List buckets
  console.log('\n3. Checking for storage buckets:');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log('   ❌ Error listing buckets:', error.message);
      return;
    }
    
    const videoBucket = buckets.find(b => b.name === 'videos');
    const thumbnailBucket = buckets.find(b => b.name === 'thumbnails');
    
    console.log('   Total buckets:', buckets.length);
    console.log('   ✓ videos bucket:', videoBucket ? `✅ Exists (${videoBucket.public ? 'PUBLIC' : 'PRIVATE'})` : '❌ Missing');
    console.log('   ✓ thumbnails bucket:', thumbnailBucket ? `✅ Exists (${thumbnailBucket.public ? 'PUBLIC' : 'PRIVATE'})` : '❌ Missing');
    
    if (!videoBucket) {
      console.log('\n   ⚠️  Missing "videos" bucket! Create it in Supabase console.');
    }
    if (!thumbnailBucket) {
      console.log('\n   ⚠️  Missing "thumbnails" bucket! Create it in Supabase console.');
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
    return;
  }

  // Test 4: Test upload to videos bucket
  console.log('\n4. Testing upload to "videos" bucket:');
  try {
    const testBuffer = Buffer.from('test content for upload');
    const testPath = 'test-upload/' + Date.now() + '.txt';
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(testPath, testBuffer, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.log('   ❌ Upload failed:', error.message);
      console.log('   This likely means:');
      console.log('      - Bucket is private (should be PUBLIC)');
      console.log('      - Storage policies are not configured');
      console.log('      - Invalid authentication key');
      return;
    }
    
    console.log('   ✅ Test upload successful');
    console.log('   📁 Uploaded to:', testPath);
    
    // Try to get public URL
    try {
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(testPath);
      console.log('   🔗 Public URL:', urlData.publicUrl);
      
      // Clean up
      await supabase.storage.from('videos').remove([testPath]);
      console.log('   ✅ Cleanup successful');
    } catch (err) {
      console.log('   ⚠️  Could not get public URL');
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }

  console.log('\n✅ Diagnostic complete!\n');
}

testSupabaseConnection().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
