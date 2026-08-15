---
title: "Ownership *in the age* of AI"
slug: ai-input-not-output
publishDate: "2026-07-22"
summary: "AI should be the input to your thinking, never the output - and what that means for how you write, review, and ship code."
tags: ["engineering", "ai", "leadership"]
---

If the contents of this post seem obvious to you, then you're already on the right track. Most of what follows isn't news - it's a description of judgment good engineers already exercise, just with sharper stakes now that generating code is nearly free.

I recently became a tech lead. The first real conversation I had with my team was about AI, and it wasn't the conversation they expected.

They expected a policy. Some guardrails, a list of approved tools, maybe a warning. What I actually wanted to talk about was one word, and it took me most of the meeting to get to it.

## This is not a post about using less AI

I want to be unambiguous here, because everything else I say will be misread otherwise.

I want us using AI more. Aggressively. For every menial task in the job - the boilerplate, the test scaffolding, the migration you've written four times before, the regex you'll never memorize. If you're hand-writing something a model could have drafted in five seconds, you're not being principled, you're being slow.

The productivity gain is real and I have no interest in litigating it.

But responsibly. And that word is doing more work than it looks like.

## The word is ownership

This is the one thing I want you to take away from this:

**No matter how much was written by AI, you must be able to defend every decision as your own.**

Not "you wrote it." Not "you understand roughly what it does." You can defend it. Someone can push on any line of it and you have an answer, because you thought about it.

That's the whole standard. Everything below is just consequences of it.

## The test

There's a simple way to check whether you own something:

Can you defend it without going back to the tool?

When someone questions your pull request, what happens next? Do you answer, because you already thought this through? Or do you paste their question into the model, read what comes back, and paste that at them?

If it's the second one, you didn't do the work. You brokered it. And everyone can tell, including the person asking.

The uncomfortable part is that this test is easy to fail quietly. Nobody catches you. The PR merges. It only surfaces later, when the thing breaks and you're the one who's supposed to know why.

## Why this matters more than it used to

A pull request is a request for someone else's time. This is the one people underrate. Shipping code you don't understand doesn't remove the thinking that code needed - it moves that thinking onto your reviewer, and it arrives amplified, because now they have to reconstruct context you already had and threw away.

You didn't save the team an hour. You spent someone else's hour, at a worse exchange rate. Sometimes the whole thing nets out slower.

When code gets cheap, judgment gets expensive. I work in payroll: tax, payments, onboarding, compliance. Customers do not pay us to produce code - code is now close to free. They pay us for knowing that a particular withholding edge case exists, that a particular payment can't be reversed after a particular hour, that a particular "small" schema change breaks a downstream report someone files with a government.

Cheap generation makes that judgment more valuable, not less. But only if you're exercising it. Judgment you've outsourced isn't judgment.

Then there's the learning trap, and it's the one that worries me most. If the tool fixes your bug and you never investigated it, then the next time it breaks, you are back at zero. No memory of the failure mode. No instinct about where to look. You didn't build the thing engineers build over a career: a mental model of a system that misbehaves in specific, learnable ways.

Do that for long enough and every day becomes your first day investigating that bug.

## Sophistication is cheap now

AI makes the appearance of expertise free.

Confident tone, precise-sounding vocabulary, structure, length. All of it, instantly, on any topic, at zero cost, whether or not there's anything underneath.

So the signals we used to read as competence have stopped being reliable. A PR title that claims a great deal over a diff that does very little. A design doc that turns out to be the PRD retyped in engineering vocabulary, restating the problem in a more expensive font.

My rule of thumb now: impressive-sounding work that its author can't explain in plain language is a red flag, not a strength. If someone can't drop the register and tell me what it does in ordinary words, that usually means the sophistication was purchased rather than earned.

## Never the output

The part people push back on most: don't post AI-generated text in Slack, in PR comments, or in docs. The AI is often right - that was never the issue. The issue is that readers clock it. There's a texture to generated prose - the hedging, the tidy parallel structure, the way it answers a question nobody quite asked - and when a reader recognizes it, something worse than "this is inefficient" happens. They trust you less. You've signaled that you didn't think about their question enough to answer it yourself.

You can use a model to help you organize what you think. Draft with it, argue with it, have it poke holes in your reasoning. That's the input.

![Two paths from a problem: AI drafts and you ship as-is, ending in "AI as the output, you brokered it" - versus AI drafts and you validate the assumptions and rewrite, ending in "AI as the input, you own it."](/blog-images/ai-input-not-output/ai-input-vs-output.svg)

Then say it in your own words. Because rewriting is not a formality - it's the step where you find out which parts you actually believe. I catch my own bad reasoning in the rewrite constantly. If you skip it, you never find out what you didn't understand.

## You're the last checkpoint

This gets concrete in two places.

When you're writing a response, the model drafts and you rewrite. Your reply exists to earn trust: here's the repro, here's the relevant part of the codebase, here's the root cause, here's the fix. That's a claim you're making about reality, with your name on it.

Pushing code is the subtler case. These tools are built to be agreeable. They will answer the question you asked, on top of assumptions you never made and never saw. The output looks like an answer to your problem. Often it's a confident answer to a slightly different problem.

So validate the assumptions before you validate the answer. And notice that you cannot validate a feature you don't understand - at that point you're not reviewing, you're hoping.

## Choosing the model is also a judgment call

A smaller point that I think generalizes.

Reaching for the heaviest available model on every prompt is the same reflex as pasting its answer without reading it. Both skip the thinking. Owning your work includes owning how you use the tool.

Match the model to the task. Heavy reasoning models are for hard problems: thorny architecture, deep debugging, ambiguous multi-file refactors, tricky algorithmic work. Most day-to-day work - scoped changes, tests, boilerplate, following a pattern that already exists in the codebase - does not need that.

But the actual skill here is decomposition. A big task that seems to require the biggest model is usually several small tasks that don't. And breaking it down does something else valuable: it makes the work reviewable. Which brings it right back to the pull request, and to somebody else's time.

![One big ambiguous task, two paths: reaching for the heaviest model produces one large diff that's hard to review - versus breaking it down first into scoped tasks, where the everyday model is enough and each diff is reviewable.](/blog-images/ai-input-not-output/decomposition.svg)

## Don't just implement. Own.

This last part is less about AI and more about what the job actually is.

You don't just build features. You own them. The difference between an owner and an implementer is behavioral, not seniority: owners collaborate, ask questions when the spec is ambiguous, and push improvements back up to product instead of silently building the thing they know is slightly wrong. Implementers close the ticket and move on.

Not the expert on that part of the system yet? Become one. That's the job, not a detour from it. And once you own an area, you're the point of contact for it. People come to you. That is, more or less, the entire idea of being an engineer.

On the ground it's less abstract than it sounds. It looks like a handful of unglamorous habits:

- Re-reading the PRD as you build, not just before you start
- Asking in the open channel instead of a DM, so the answer helps the next person who hits the same question
- Confirming a decision instead of assuming it
- Proposing the alternative, not just flagging the problem

None of this is new, and none of it is about AI. It's what good engineers have always done. What's changed is that it's now easier than ever to skip all four and still ship something that looks finished.

## What this comes down to

Three things, stated flat:

1. Use any tool you want. You must be able to defend the work as your own. If you can't explain why a decision is correct, it isn't ready for review.
2. No AI-generated text in Slack or PR comments. Write like someone who understands the problem, because you do.
3. All communication - Slack, PRs, docs - has to be high-signal.

We are not slowing down. When anyone can generate code, judgment is what a team gets known for. Use the tools hard, and own what comes out of them.

AI is the input to your thinking. It cannot be the output.
