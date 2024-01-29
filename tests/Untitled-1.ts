// it('Should return the 201 status and json food', async () => {

    //     const testSession = session(app)

    //     const authReq = await testSession
    //       .post('/login')
    //       .send({email: 'emile00013+2@gmail.com', password: 'P4$$w0rd'})
    //       .redirects(1);
        
    //     expect(authReq.statusCode).toBe(200)
        
    //     const name = 'New food_' + generateRandomString(5);
    //     const carbohydrate = Math.floor(Math.random() * 10);
    //     const fat  = Math.floor(Math.random() * 10);
    //     const protein = Math.floor(Math.random() * 10);
     
    //     const rawData = JSON.stringify({
    //         name : name,
    //         carbohydrate : carbohydrate,
    //         protein : protein,
    //         fat : fat,
    //         trans_fat : fat/2,
    //         is_meat: false,
    //         is_milk: false,
    //         is_egg: false,

    //     });

    //     const res = await testSession
    //         .post('/api/food')
    //         .send(rawData);

    //     const jsonRes = JSON.parse(res.text);
        
    //     // const food = await Food.findOne({where : rawData});

    //     // expect(food).not.toBe(null);
    //     // expect(food).not.toBeUndefined();
    //     expect(jsonRes.code).toEqual(201);
    //     expect(res.statusCode).toEqual(201);

    
    // });




    // async function generateRandomString(length) {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';

//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         result += characters.charAt(randomIndex);
//     }

//     return result;
// }