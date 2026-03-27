const { User, Dish, DishFood, Food, AteFood, Exercise, ExerciseTrain, ExerciseTrainDraft, ProgramDraft, Program, Train, TrainDraft, sequelize} = require('./models')
const { faker } = require('@faker-js/faker');
const { publishTrain } = require('./services/train');
const {generateStripeUser} = require('./services/user');
const foodsDataJson = require('./sample_data_json/food.json')
const exerisesDataJson = require('./sample_data_json/exercise.json')
const dishesDataJson  = require('./sample_data_json/dish.json')/**/
const dotenv = require('dotenv').config();
const pbkdf2 = require("hash-password-pbkdf2")
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const readline = require('readline');

/*const args = process.argv.slice(2); // remove 'node' and 'file.js'
let customOp; 
args.forEach(arg => {
  if (arg.startsWith('--custom-option=')) {
    customOp = arg.split('=')[1];
  }
});*/


const exercises = []

async function genrateSampleData () {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
        });

        rl.question('La base de données va être écrasé et les données seront irrécupérable, entrez "je prends le risque" pour confirmer la suppression : ', async (answer) => {

        if ("je prends le risque" === answer) {
            
            try {

                if (process.env.NODE_ENV === 'test') {
                    
                    const customers = await stripe.customers.list({})
                    customers.data.forEach(async (customer) => {
                        await stripe.customers.del(customer.id)
                    });

                    await sequelize.sync({ force: true })
                    async function generateExercise() {

                        exerisesDataJson.forEach(async (exerciseJson) => {
                            const exercise = await Exercise.create(exerciseJson)
                            exercises.push(exercise)
                        });
                        console.log('Generate exercises')

                        for (let iProgram = 0; iProgram < 10; iProgram++) {

                            const programDraft = await ProgramDraft.create({
                                name : 'Programme n° ' + iProgram,
                                description : faker.commerce.productDescription(),
                                imageUrl : 'palceholder-elderly-fit.jpg'
                            });
                            console.log('Generate program draft : ' + programDraft.name)

                            const numberOfTrain = getRandomArbitrary(1, 4);
                            console.log(numberOfTrain)

                            for (let iTrain = 0; iTrain < numberOfTrain; iTrain++) {

                                const trainDraft = await TrainDraft.create({
                                    name : 'Train n°' + iTrain + 'programe n°' + iProgram,
                                    description : faker.commerce.productDescription(),
                                    programDraftId : programDraft.id,
                                    ordering : iTrain

                                })
                                console.log('Generate train draft : ' + trainDraft.name)


                                const numberOfExercise = getRandomArbitrary(1, 5);

                                for (let iExerciseTrain = 0; iExerciseTrain < numberOfExercise; iExerciseTrain++) {

                                    const repsMode = ['sdc', 'reps']
                                    const exerciseRandomIndex = getRandomArbitrary(0, exercises.length)

                                    const exerciseTrainDraft =  await ExerciseTrainDraft.create({
                                        exerciseId : exercises[exerciseRandomIndex].id,
                                        trainDraftId : trainDraft.id,
                                        sets : getRandomArbitrary(1, 3),
                                        reps : getRandomArbitrary(5, 20),
                                        repsMode : repsMode[iExerciseTrain%2],
                                        ordering : iExerciseTrain
                                    })
                                    console.log('Exercise for train draft : ' + trainDraft.name)

                                }

                                if (iProgram % 2 === 1) {

                                    const programOrErrorMessage = await publishTrain(programDraft.id);

                                    if (programOrErrorMessage instanceof Program) {
                                        console.log('Publish program draft : ' + programDraft.name +', final program '+ programOrErrorMessage.name);
                                    } else {
                                        console.log('ERROR : Publication of program draft : ' + programDraft.name);
                                    }

                                }
                            }
                        }
                    }

                    function generateFoodNDish() {

                        foodsDataJson.forEach(async (foodJson) => {await Food.create(foodJson)});
                        console.log('Generate foods')
                        dishesDataJson.forEach(async (dishJson) => {await Dish.create(dishJson)});
                        console.log('Generate dishes')
                        dishFoodsDataJson.forEach(async (dishFoodJson) => {await DishFood.create(dishFoodJson)});
                        console.log('Generate dishFoods')
                        console.log('Generate foods and dishes')

                    }

                    async function generateUsers(count = 10) {
                        const testPassword = 'testpassword'
                        const users = [];

                        for (let i = 0; i < count; i++) {
                            sufix = '';
                            const role = ['user']
                            if (i%2===0) {
                                role.push('admin'); 
                                sufix = 'Admin';
                            }
                            const hashedPassword = pbkdf2.hashSync(testPassword);

                            const user = await User.create({
                                name: 'FakerUser'+sufix,
                                email: faker.internet.email(),
                                password: hashedPassword,
                                role: role,
                                birthDay: faker.date.past(),
                                objectiv: (i%2+1),
                                createdAt: faker.date.past()
                                
                            });

                            const customer = await generateStripeUser(user);
                            // generateFalseSubscriptions(customer, i);
                        }

                        console.log('Generate users');
                    }

                    generateUsers();
                    generateExercise();
                    generateFoodNDish();
                    console.log('TODO : \n\n S\'abonner à un compte premium sur au moins 2 deux comptes. \n Créer un profession qui date de 6 à 15 jours sur deux comptes.')
                    
                } else throw new Error('Il faut être en environnement de test.');

            } catch (error) {

                console.log('Error : ' + error.message)
        }

        }

        rl.close();

    });

}
genrateSampleData()

function getRandomArbitrary(min, max) {
  const float = ( Math.random() * (max - min) + min);
  const int = float - (float%1);
  
  return int
}

async function generateFalseSubscriptions(customer, dividor) {

    const productsList = await stripe.products.list({
        active : true
    });

    const i = dividor % 6

    if (i < productsList.data.length) {
        const priceId = productsList.data[i].defaultPrice

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'us_bank_account',
            us_bank_account: {
                account_holder_type: 'individual',
                account_number: '000123456789',
                routing_number: '110000000',
            },
            billing_details: {
                name: 'John Doe',
            },
        });
        
        await stripe.paymentMethod.us_bank_account.verifySource()
    
        const paymentMethodAttached = await stripe.paymentMethods.attach(
            paymentMethod.id,
            {
                customer: customer.id
            }
        );
        /*
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId},],
            cancel_at: Math.floor(endDate.getTime() / 1000),
            expand: ['latest_invoice.payment_intent'],
        });*/
    }
}
