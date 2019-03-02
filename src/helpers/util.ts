import express from "express";

export const defaultSuccessCallback = (res: express.Response) => { res.send({data: "success"}) }