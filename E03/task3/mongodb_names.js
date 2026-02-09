import "dotenv/config";
import mongoose from "mongoose";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import Person from "./models/Person.js";

const argv = yargs(hideBin(process.argv)).command("add <firstname> <lastname>", "Add a new name").help().argv;

try {
  await mongoose.connect(process.env.MONGO_URI);

  if (argv._.length === 0) {
    const persons = await Person.find({});
    for (const person of persons) {
      console.log(`${person.firstname} ${person.lastname}`);
    }
  } else {
    // Add new name
    const firstname = argv.firstname;
    const lastname = argv.lastname;

    const enteredPerson = new Person({
      firstname: firstname,
      lastname: lastname,
    });

    await enteredPerson.save();

    console.log(`Added ${firstname} ${lastname} to database`);
  }
} catch (error) {
  console.error("Error:", error.message);
} finally {
  await mongoose.connection.close();
}
