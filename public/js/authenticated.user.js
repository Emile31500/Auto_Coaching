async function getAuthenticatedUser() {

   const res = await fetch('/api/user/authenticated', {
        method : 'GET',
        headers : {
            'Content-type' : 'application/json'
        }
   }).then(response => {

        return response.json();

   }).then(data => {

        if (data.code === 200) {

            return data.data

        } else {

            return false;

        }

   })

   return res

}
