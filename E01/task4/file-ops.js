import { writeFile, readFile } from "fs/promises";

const fileName = "output.txt";

const content = `My name is LazyBee and today is ${new Date().toLocaleDateString()} and current time is ${new Date().toLocaleString()}`;

writeFile(fileName, content);

async function main() {
  try {
    await writeFile(fileName, content);
    console.log(`Content wrote to ${fileName}`);

    const outputContent = await readFile(fileName, "utf-8");
    console.log(`Content read from ${fileName}`);
    console.log(outputContent);
  } catch (error) {
    console.log(error);
  }
}

main();
