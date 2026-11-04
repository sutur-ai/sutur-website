import Link from 'next/link';
import type { Metadata } from 'next';
import { ADDRESS, COMPANY, LegalPage, Mail, Table } from '../../components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What Sutur collects when you use Rafic, why, who receives it, how long we keep it, and how to have it deleted.',
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return <LegalPage title="Rafic Privacy Policy">
    <p>Effective <time dateTime="2026-11-04">4 November 2026</time></p>
    <p>This policy explains what Sutur Inc. (&ldquo;Sutur&rdquo;, &ldquo;we&rdquo;) collects when you use <strong>Rafic</strong>: the iPhone app, the web app at app.sutur.ai, and the AI agent that works for your organisation. It also explains why we collect it, who receives it, how long we keep it, and how to have it deleted.</p>
    <p>Rafic is a business product. Your organisation gives you your account, and your organisation&rsquo;s workspace (its &ldquo;seat&rdquo;) holds the agent&rsquo;s work. Where your organisation has its own agreement with Sutur, that agreement also governs how we handle its data.</p>

    <h2>What we collect and why</h2>
    <p>We collect only what Rafic needs to work. We do not sell your data. We do not use it for advertising. We do not track you across other companies&rsquo; apps or websites. Rafic contains no advertising, analytics or crash-reporting software.</p>
    <Table head={['What', 'Why']} rows={[
      [<><strong>Your email address and password.</strong> Your organisation&rsquo;s administrator sets the email when inviting you. We store the password only as an Argon2id hash. If you turn on two-step sign-in, we store its secret encrypted.</>, 'To sign you in, and to send invitations and password-reset emails'],
      [<><strong>Your name</strong> as your organisation&rsquo;s workspace records it</>, <>To show who you are in Rafic and to name your phone (for example &ldquo;Sam&rsquo;s iPhone&rdquo;) when you lend it files</>],
      [<><strong>Account and device identifiers</strong>: your account id, your session and device ids, and the public keys your iPhone creates in its Secure Enclave</>, <>To keep you signed in, and to make sure a session can&rsquo;t be copied to another device. The private keys never leave your phone.</>],
      [<><strong>Notification details</strong>: Apple&rsquo;s push token for your iPhone, and the public key your phone uses to decrypt notifications</>, 'To deliver notifications'],
      [<><strong>What you write and share with Rafic</strong>: chat messages, instructions, pages, feedback on answers, and files you attach (documents, photos, videos)</>, 'To do the work you ask the agent to do'],
      [<><strong>Dictation audio</strong>, recorded only while you dictate</>, 'To turn your speech into text. The recording is deleted after transcription; the text joins your chat.'],
      [<><strong>Phone files</strong>: the names and contents of files inside folders you choose to lend from your iPhone, and only those folders</>, 'So the agent can read and change those files for you. You can turn this off at any time.'],
      [<><strong>Connected apps</strong>: if you connect accounts such as email, calendar or code hosting, their credentials (encrypted before upload) and whatever the agent reads there for your tasks</>, 'To let the agent act in those apps on your instructions'],
      [<><strong>IP address and sign-in events</strong>: the time, the outcome, your IP address and a hash of your email</>, 'To protect accounts against abuse and to investigate security incidents'],
    ]} />
    <p>We don&rsquo;t collect your location, contacts, health or financial information, or your browsing history.</p>

    <h2>Who receives your data</h2>
    <h3>Sutur&rsquo;s own services</h3>
    <ul>
      <li>Sign-in and the Rafic service run on Amazon Web Services in Frankfurt, Germany (eu-central-1).</li>
      <li>Your organisation&rsquo;s agent runs on a dedicated server, normally hosted by Hetzner Online in Falkenstein, Germany. An organisation&rsquo;s server may be placed elsewhere, or the organisation may provide its own.</li>
      <li>Cloudflare carries all web traffic to app.sutur.ai.</li>
      <li>Amazon Simple Email Service sends invitation and password-reset emails.</li>
    </ul>
    <p><strong>AI model providers.</strong> To answer you, your organisation&rsquo;s agent sends the content of your conversations to an AI model provider. That includes the messages, the files and folder contents it reads, and its instructions and memory.</p>
    <ul>
      <li><strong>Default:</strong> Sutur uses the <strong>DeepSeek V4.1 Flash</strong> model, reached through <strong>OpenRouter</strong>, to understand and write text. OpenRouter runs it on DeepSeek&rsquo;s own service or on another host it picks. Sutur also uses <strong>Google Gemini</strong>, through OpenRouter, to read images and documents.</li>
      <li><strong>Other providers:</strong> your organisation may choose a different provider instead. The available choices are OpenAI (including ChatGPT), Anthropic, Google, xAI, DeepSeek, Z.ai, Moonshot AI (Kimi), MiniMax and Alibaba Cloud (Qwen).</li>
      <li><strong>Dictation:</strong> dictation is normally transcribed on your organisation&rsquo;s own Sutur server. If your organisation turns on hosted transcription, recordings go through OpenRouter to Microsoft, ElevenLabs, Google and DeepSeek. We ask these providers not to retain the audio.</li>
      <li><strong>Web search:</strong> when the agent searches the web for you, the search terms and the pages it opens go to a search provider. That is OpenAI if your organisation uses a ChatGPT account; otherwise Exa, Parallel, Firecrawl and Keenable, without your identity.</li>
      <li><strong>Consent:</strong> the Rafic iPhone app asks for your permission before your content is first sent to an AI provider, and names the providers.</li>
    </ul>
    <p><strong>Apple.</strong> Apple&rsquo;s push service delivers notifications to your iPhone. It receives your phone&rsquo;s push token and a notification that says only &ldquo;Rafic – New activity&rdquo;. The actual text is encrypted to a key that exists only on your phone, so neither Apple nor the push servers can read it.</p>
    <p><strong>Apps you connect.</strong> If you connect another service, the agent sends it what your tasks need, on your instructions.</p>
    <p><strong>Required by law.</strong> We disclose data when the law requires it.</p>
    <p>We don&rsquo;t share your data with anyone else.</p>

    <h2>How long we keep it</h2>
    <Table head={['Data', 'Retention']} rows={[
      ['Account (email, password hash, two-step data)', 'Until your account is deleted'],
      ['Web sign-in sessions', 'End after 30 days without use, and after 90 days in any case'],
      ['iPhone device sessions', 'End after 30 days without use, or when you sign out or remove the device'],
      ['Push registrations', 'Removed with the device, or when Apple reports the token is no longer valid'],
      ['Conversations on your organisation’s agent', 'Kept until you or your organisation deletes them. You can delete a conversation at any time.'],
      ['Files you upload, and files the agent saves for you', 'Kept on your organisation’s agent until deleted'],
      ['Earlier versions of files the agent changes there', '7 days'],
      ['Sign-in security logs', '400 days'],
      ['Database backups', '7 days'],
      ['Optional backups of your organisation’s agent, if your organisation enables them', '30 days off-site, plus the last 3 on the server'],
      ['Files of yours that the agent changed or deleted on your iPhone', 'Kept as copies on your phone only, so you can restore them, until you sign out or delete the app'],
    ]} />

    <h2>Deleting your account</h2>
    <p>In the Rafic app, choose <strong>Delete account</strong> and confirm with your password. Sutur staff complete the deletion <strong>within 30 days</strong> and email you when it is done. If you can&rsquo;t use the app, write to <Mail />. What is deleted, and what remains for a time, is set out at <Link href="/delete-account">https://sutur.ai/delete-account</Link>.</p>

    <h2>Your rights</h2>
    <p>You can ask us for a copy of your data, to correct it, or to delete it. Where the law gives you more rights, for example in the European Union, the United Kingdom or California, you can also object to or restrict processing. Write to <Mail />.</p>
    <p>If your organisation gave you your account, we may pass your request to your organisation, since it decides how its workspace is used.</p>

    <h2>Security</h2>
    <ul>
      <li>Data travels encrypted.</li>
      <li>Your iPhone&rsquo;s sign-in is bound to a key in its Secure Enclave.</li>
      <li>Notifications are end-to-end encrypted to your phone.</li>
      <li>Files you lend from your phone travel end-to-end encrypted to your organisation&rsquo;s agent.</li>
      <li>Our databases are encrypted at rest.</li>
    </ul>

    <h2>Children</h2>
    <p>Rafic is for work. It is not directed at children, and accounts are issued only by organisations.</p>

    <h2>International transfers</h2>
    <p>Sutur Inc. is a US company. Our main services run in Germany. AI providers and other recipients listed above may process data in the United States and other countries.</p>

    <h2>Changes</h2>
    <p>If we change this policy, we will post the new version here with a new effective date. If the change is significant, we will also tell you in the app.</p>

    <h2>Contact</h2>
    <p>{COMPANY}<br />{ADDRESS}<br />Privacy: <Mail /></p>
  </LegalPage>;
}
