//project.js

const express = require('express');
const router = express.Router();
const db = require('../../db-module.js');

router.get('/projects', async (req, res) => {
    try {
        const projects = await db.getAll('project');
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/authenticate-project', async (req, res) => {
    console.log('Authenticating project...');
    const sessionParam = req.query.session;
    const projectParam = parseInt(req.query.project, 10);

    try {
        const project = await db.getAll('project', { project_id: projectParam });
        console.log(project)
        // authenticate if the current project belongs to the questioned session
        try {
            const session = await db.getAll('session', { session_key: sessionParam });

            console.log('Session:', session[0].session_key);
            console.log('Project:', project[0].project_id);
            if (session[0].session_key === project[0].associated_session_key){
                console.log('Project has been loaded sucessfully!');
                res.status(200).json({ message: 'Project has been loaded sucessfully!' });

            }else{
                console.error('The current session does not have permissions for this project');
                res.status(401).json({ message: 'The current session does not have permissions for this project' });
            }

        } catch (error) {
            console.error('Error fetching sessions:', error.message);
            res.status(500).json({ error: error.message });
        }



    } catch (error) {
        console.error('Error fetching projects:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.put("/update-project/:id", async (req, res) => {
    const { id } = req.params;
    const { body: { project_name } } = req.body;
    const projectId = parseInt(id, 10);

    try {
        const success = await db.update('project', { project_id: projectId }, { project_name: project_name }  );
        console.log("Updating project with ID " + id);
        console.log(`New project name is ${project_name}`);
        res.json({ success });
    } catch (error) {
        console.error("Error updating project: ", error.message);
        res.status(500).json({ error: "Failed to update project" });
    }
});

router.get('/sessions/:id/projects', async (req, res) => {
    const { id } = req.params;
    try {
        const projects = await db.getAll('project', { associated_session_key: id });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/create-project', async (req, res) => {
    const { session_key } = req.body;

    const { body: { name } } = req.body;
    const { body: { associated_session_key } } = req.body;
    

    const defaultPanels = ['TO DO', 'DOING', 'DONE'];

    try {
        const projects = await db.getAll('project');
        const newEntryId = projects.length;

        await db.create('project', { project_id: newEntryId, project_name: name, associated_session_key: associated_session_key });
        //console.log('New id: ' + newEntryId);

        res.status(201).json({ project_id: newEntryId.project_id });


        //create three default panels for the new project
        const panels = await db.getAll('panel');
        const newPanelBaseId = panels.length;
        for (let i = 0; i < defaultPanels.length; i++){
            await db.create('panel', { panel_id: (newPanelBaseId + i), panel_name: defaultPanels[i], parent_project_id: newEntryId });
        }

        console.log("Creating a new project...");

    } catch (error) {
        console.error('Error creating project:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/projects/:id/panels', async (req, res) => {
    const { id } = req.params;
    const projectId = parseInt(id, 10);
    console.log("Passed id to fetch projects is: " + id)
    try {
        const panels = await db.getAll('panel', {parent_project_id: projectId});
        res.json(panels);
    } catch (error) {
        console.error('Error fetching panels:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/delete-project/:id', async (req, res) => {
    const { id } = req.params;
    const projectId = parseInt(id, 10);
    console.log("Deleting project with ID " + id);
    const notes = await db.getAll('note');
    const panels = await db.getAll('panel', { parent_project_id: projectId });

    console.log(notes);
    for (x = 0; x < panels.length; x++){
        for (y = 0; y < notes.length; y++){
            if (notes[y].parent_panel_id == panels[x].panel_id){
                await db.remove('note', { parent_panel_id: panels[x].panel_id });
            }
        }
    }
    await db.remove('panel', { parent_project_id: projectId });
    const success = await db.remove('project', { project_id: projectId });
    if (success) {
        res.status(201).json({ message: "Project deleted successfully with id" + id });
    } else {
        res.status(404).json({ error: "Project not found." });
    }
});

module.exports = router;