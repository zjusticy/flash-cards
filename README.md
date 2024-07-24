[**DEMO**](https://flash-cards.vercel.app/local/intro)

## Description

This is a flashcard web app that helps you memorize anything for free. It is built with React, Zustand, Firebase and Google's Gemini AI. You can create your own card collections.

![](https://github.com/zjusticy/imgs_lib/blob/master/memoryCardMemBoard.png)

**Some features**:

- Markdown supported
- Simple and fun user interface
- Serverless design
- Use generative ai to generate cards content (Gemini flash 1.5)

## How to use

1.  Clone the repository.

2.  `cd` into the project folder.

3.  `yarn install`

4.  `yarn start`

## Manual

1. **Create a new list of cards**

Type test in the input window below, then click add. We have a new list named test.

![](https://github.com/zjusticy/imgs_lib/blob/master/addList.png)

2. **Add the card**

At card create page, type questions at the left top window and extra information for AI at the left bottom window (Ignore this part when you don't want to use AI). Write the answer at the right side or click the AI button to automatically get the result from Gemini AI. After click the add button, we have a question ${(1+2)?}$ and an answer ${3}$.

![](https://github.com/zjusticy/imgs_lib/blob/master/cardManual/gen-ai-example-readme.png)

We can also type “# first” at the start of the obverse side to set the title of the card as first.

3. **Update the card**

Click the cards at side bar, then we can modify and update the cards stored earlier.

![](https://github.com/zjusticy/imgs_lib/blob/master/update.png)

4. **Select the list to memorize**

After all the cards are added to the list, and you want to start memorize the content. Go to the home page, and click the name “test” in the lists section.

![](https://github.com/zjusticy/imgs_lib/blob/master/memList.png)

5. **That’s it**. Now you can enjoy memorize the cards!

![](https://github.com/zjusticy/imgs_lib/blob/master/memCard.png)

[More Info](https://github.com/zjusticy/flashCards/blob/master/doc/userManual.md)

## Learn More

You can learn more in the [blog](https://zjusticy.github.io/blog/a-flash-cards-project).

For Gemini AI [Gemini deploy blog](https://zjusticy.github.io/blog/generative-ai-in-flash-card)
