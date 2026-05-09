const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

(async () => {
  const dir = path.join(process.cwd(), 'test-repo');
  fs.mkdirSync(dir, { recursive: true });
  await git.init({ fs, dir });
  
  fs.writeFileSync(path.join(dir, 'file.txt'), 'line1\n');
  await git.add({ fs, dir, filepath: 'file.txt' });
  let sha1 = await git.commit({ fs, dir, message: 'init', author: { name: 'A', email: 'a@a' } });

  await git.branch({ fs, dir, ref: 'feature' });

  // checkout feature and modify
  await git.checkout({ fs, dir, ref: 'feature' });
  fs.writeFileSync(path.join(dir, 'file.txt'), 'line1\nfeature-mod\n');
  await git.add({ fs, dir, filepath: 'file.txt' });
  await git.commit({ fs, dir, message: 'feature commit', author: { name: 'A', email: 'a@a' } });

  // checkout main and modify
  await git.checkout({ fs, dir, ref: 'main' });
  fs.writeFileSync(path.join(dir, 'file.txt'), 'line1\nmain-mod\n');
  await git.add({ fs, dir, filepath: 'file.txt' });
  await git.commit({ fs, dir, message: 'main commit', author: { name: 'A', email: 'a@a' } });

  // try merge
  try {
    console.log('Merging...');
    await git.merge({ fs, dir, ours: 'main', theirs: 'feature', abortOnConflict: false, author: { name: 'A', email: 'a@a' } });
    console.log('Merge successful!');
  } catch (err) {
    console.error('Merge error:', err.message, err.data);
    const files = fs.readdirSync(path.join(dir, '.git'));
    console.log('.git files:', files);
  }
})();
