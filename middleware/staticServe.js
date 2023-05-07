// Oak's built-in static serving - serves up the homepage
export const staticServe = async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/front-end`,
      index: "index.html",
    });
  } catch (error){
    next();
    console.log(error);
  }
};
