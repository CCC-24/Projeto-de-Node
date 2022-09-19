const { response } = require('express')
const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('API Projeto TOTI');
})

// List tasks
app.get('/tasks',async (req, res) => {
  const todasTarefas = await tasks.findAll() 
  res.status(200).json({todasTarefas})
})

// Create task
app.post('/tasks', async (req, res) => {
  const {description, done} = req.body
  if(description == null || done == null ) {
res.status(400).send('Valores invalido')
  }
else{
  if(done == true || done == false){
    const tarefa = await tasks.create({
      description, done
    })
    res.status(200).send('cadastro feito com sucesso')
  }
  else {
    res.status(400).send('Faltal erro: valor do Done invalido')
  }
}
  
})

// Show task
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const tarefa = await tasks.findByPk(taskId)

  if(tarefa){
    res.status(200).json({tarefa})
    return;
  }

  if(isNaN(taskId)){
    res.status(400).send('acesso invalido')
    return;
  }
  else{
    res.status(500).send('taresa não encontrada')
    return;
  }

 
})

// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const task = await tasks.findOne({ where: { id: taskId}});
  const { description, done} = req.body;

if(isNaN(taskId)){
    res.status(400).send('Id inavlida insira numero enteiro para id')
    return;
   }
  if(!task){
    res.status(500).send('tarefa não encontrada')
    return;
  }
  if(done == null){
    task.set(req.body);
  await task.save();
  res.status(200).send('tarefa atualizada');

  }
else{

  if(done == true || done == false){
    task.set(req.body);
  await task.save();
  res.status(200).send('tarefa atualizada');
  }
  else{
    res.status(400).send('valor do done é invalido')
  }
}
})
  

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id

  const tarefa = await tasks.findByPk(taskId);

  if (tarefa){
    await tasks.destroy({where: {id:taskId}});
    res.send('Tarefa excluída')
    return;
  }
  if(isNaN(taskId)){
    res.status(400).send('tarefa invalida')
    return;
  }
  else {
    res.status(500).send('Tarefa não encontrada')
    return;
  }
})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
