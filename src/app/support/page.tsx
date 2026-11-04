import Link from 'next/link';
import type { Metadata } from 'next';
import { ADDRESS, LegalPage, Mail, Phone } from '../../components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Support',
  description: 'How to reach Rafic support, get started, and fix common problems.',
  alternates: { canonical: '/support' },
};

export default function Support() {
  return <LegalPage title="Rafic support">
    <p><strong>Email:</strong> <Mail /><br /><strong>Phone:</strong> <Phone /></p>
    <p>We answer within 2 business days.</p>

    <h2>Getting started</h2>
    <ul>
      <li><strong>Rafic needs a Sutur workspace account.</strong> Your organisation&rsquo;s administrator invites you by email. Open the invitation and set a password, then sign in on the app&rsquo;s first screen with that email and password.</li>
      <li><strong>No invitation?</strong> Ask your organisation&rsquo;s Sutur administrator, or write to us.</li>
    </ul>

    <h2>Common questions</h2>
    <h3>I don&rsquo;t get notifications.</h3>
    <p>Open iOS <strong>Settings → Notifications → Rafic</strong> and allow notifications. Then open Rafic once so it can register.</p>
    <p>A notification that says only &ldquo;New activity&rdquo; means your phone couldn&rsquo;t decrypt the message. Sign out and sign in again to make new keys.</p>
    <h3>What is &ldquo;Phone files&rdquo;?</h3>
    <p>Long-press the Rafic icon and choose <strong>Phone files</strong>. There you can lend Rafic one or more folders from the Files app. The agent can work only inside those folders. If it changes or deletes a file, Rafic keeps a copy on your phone that you can restore. Turn the switch off to stop.</p>
    <h3>Dictation doesn&rsquo;t start.</h3>
    <p>Allow the microphone in <strong>Settings → Rafic</strong>. Rafic uses the microphone only while you dictate.</p>
    <h3>Sign out, or remove a lost phone.</h3>
    <ul>
      <li>To sign out, use Sign out in the app&rsquo;s account menu.</li>
      <li>To remove a lost phone, sign in to <a href="https://app.sutur.ai">https://app.sutur.ai</a> on a computer and remove the phone under your devices.</li>
    </ul>
    <h3>Which AI providers see my data?</h3>
    <p>See the &ldquo;Who receives your data&rdquo; section of our privacy policy: <Link href="/privacy">https://sutur.ai/privacy</Link></p>
    <h3>Delete my account.</h3>
    <p>In the app, go to <strong>Settings › Account › Delete account</strong>, or go to <Link href="/delete-account">https://sutur.ai/delete-account</Link>. Deletion is completed within 30 days.</p>

    <h2>Report a problem or abuse</h2>
    <p>Write to <Mail />. Tell us:</p>
    <ul>
      <li>your Rafic version (iOS <strong>Settings → General → iPhone Storage → Rafic</strong>)</li>
      <li>your iPhone model and iOS version</li>
      <li>what happened</li>
    </ul>
    <p>Never send your password.</p>

    <h2>Company</h2>
    <p>Sutur Inc., a Delaware corporation<br />{ADDRESS}</p>
  </LegalPage>;
}
