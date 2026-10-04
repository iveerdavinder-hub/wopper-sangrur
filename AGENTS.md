<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Business facts (address, phone, hours, activities, WhatsApp) live in `src/lib/site.ts`; reuse it so details stay in one place.
- Enquiries are inserted from the browser into the `enquiries` table (anon insert policy + DB length checks); only users with the `admin` role in `user_roles` can read them at `/admin`.
