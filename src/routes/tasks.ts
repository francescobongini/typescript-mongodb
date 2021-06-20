import { Router, Request, Response } from 'express';
const router = Router();

// Model
import Task from '../models/Task';

router.route('/create')
    .get((req: Request, res: Response) => {
        res.render('tasks/create');
    })
    .post(async (req: Request, res: Response) => {
        const { title, description, available } = req.body;
        const task = new Task({ title, description,available});

        await task.save();
        res.redirect('/tasks/list');
    });


router.route('/list')
    .get(async (req: Request, res: Response) => {
        const tasks = await Task.find();
        res.render('tasks/list', { tasks });
    });
router.route('/occupato')
    .get(async (req: Request, res: Response) => {
        res.render('tasks/occupato');
    });

    router.route('/list2')
    .get(async (req: Request, res: Response) => {
        const tasks = await Task.find();
        res.render('tasks/list2', { tasks });
    });

router.route('/delete/:id')
    .get(async (req: Request, res: Response) => {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.redirect('/tasks/list');
    });



router.route('/edit/:id')
    .get(async (req: Request, res: Response) => {
        const { id } = req.params;
        const task = await Task.findById(id);
        console.log(task)
        if(task['available']=="prenotato"){
            console.log("lo slot non è più disponibile!")
            //res.redirect('/tasks/list2');
        }
        res.render('tasks/edit', { task });
    })
    .post(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { title, description, available } = req.body;
        const task = await Task.findById(id);
        if(task['available']=="prenotato"){
            console.log("lo slot non è più disponibile!")
            res.redirect('/tasks/occupato');
        } else{
            await Task.findByIdAndUpdate(id, {
                title, description, available
            });
        }
        await Task.updateOne(
            { "available" : "disponibile" }, // specifies the document to update
            {
                $set: {  "available" : "prenotato"}
            }
        )
        res.redirect('/tasks/list');
        }
)

export default router;