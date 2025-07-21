clone the repo
git clone https://github.com/zany49/lemon.git

Go to Fe Folder, open terminal run
npm i
then run : npm run dev
please refer the mail for evn creds

Routes of FE
'/register' -> Home route where you register user
'/login'    -> where you login with that credential
'/task/dashboard' -> where yiou can Perform your Task management



Go to BE Folder, open terminal run
npm i
then run : npm start
please refer the mail for evn creds

Auth routes
'/api/register' -> Home route where you register user : body - email,password
'/api/login'    -> where you login with that credential : body - email,password
'/api/check-user'   -> Too check current user
'/api/logout        -> too clear cookies


Task routes -  protected , I've used Redis cloud -> refer email for env values
'/api/create-task'     -> create task
'/api/get-task-list'   -> Get all created Task
'/api/get-task/:id'    -> Get Task  By Id
'/api/update-task/:id' -> To update Task
'/api/delete-task/:id' -> To delete Task
'/api/clear-cache'     -> To clear redis cache