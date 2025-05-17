---
title: Git submodules for dummies
excerpt: A great option to share code between multiple projects is by using git submodules, but there are a few things you need to keep in mind.
date: 2024-03-24
image: img20241027_20215192.webp
---

A great option to share code between multiple projects is by using git submodules, but there are a few things you need to keep in mind.

## The scenario

Let's say you have two projects which both want to use the same database connector.
Instead of having two copies of this code and risking accidentally making changes to one and forgetting to add these changes to the other project,
You can create a Git repository for this database connector and add this repository as a submodule in both projects.

## Initializing a submodule

You can add submodules to a project using the following command:

```sh
git submodule add https://github.com/chaconinc/DbConnector
```

This will create a directory named the same as the submodule's repository, inside your already existing Git project.
Running this command will also add the `.gitmodules` file, you need to track this file in the project so Git knows where the submodules are and what URL they are pointing to.

```
[submodule "DbConnector"]
	path = DbConnector
	url = https://github.com/chaconinc/DbConnector
```

Now you can add the changes to the project and commit them.
This doesn't commit all files in the submodule, but instead commits the hash of a specific branch.
Meaning you can develop changes to the submodule on a branch and check this branch out in your projects for testing.
You do need to keep in mind that you probably only want to have the master branch checked out in production.

## Cloning a project with submodules

When cloning a project with existing submodules, these will show up as empty directories and you will need to run the following command to initialize them.

```sh
git submodule init
```

This will clone all the files into the empty directories, this command should also be part of your deployment pipeline.

## Resetting the submodule

If you accidentally made some changes in a submodule thinking it was the projects code and you want to reset these changes you can run:

```sh
git submodule update

```

This will discard the changes and checkout the last committed hash for that projects branch.

In my experience I've never needed to use more than these few commands.
