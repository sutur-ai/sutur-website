import Link from 'next/link';
import type { Metadata } from 'next';
import { ADDRESS, COMPANY, LegalPage, Mail, Table } from '../../components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Delete your account',
  description: 'How to ask Sutur to delete your Rafic account, what is deleted, and what remains for a time.',
  alternates: { canonical: '/delete-account' },
};

export default function DeleteAccount() {
  return <LegalPage title="Delete your Rafic account">
    <h2>How to ask</h2>
    <p><strong>In the app:</strong></p>
    <ol>
      <li>Open Rafic and go to <strong>Settings › Account › Delete account</strong>.</li>
      <li>Confirm with your email and current password. If you use two-step sign-in, enter your code too.</li>
      <li>You get an email confirming the request and the date by which it will be done.</li>
    </ol>
    <p>Asking again doesn&rsquo;t create a second request; you see the same pending request and date.</p>
    <p><strong>If you can&rsquo;t use the app,</strong> write to <Mail /> from the email address on your account.</p>

    <h2>What happens next</h2>
    <p>Sutur staff delete your account by hand <strong>within 30 days</strong> of your request. When they finish, they email you. To cancel before then, reply to the confirmation email.</p>
    <p>Nothing is deleted the moment you ask; the request starts the staff process below.</p>

    <h2>What Sutur staff delete</h2>
    <p><strong>Your sign-in account.</strong> Your email, password hash, username, two-step secret, recovery codes and sign-in links.</p>
    <p><strong>Your Rafic account data.</strong></p>
    <ul>
      <li>Your membership of the workspace, and with it:
        <ul>
          <li>your conversations&rsquo; records</li>
          <li>web push subscriptions</li>
          <li>chat runs</li>
          <li>pending app sign-ins</li>
        </ul>
      </li>
      <li>Your app connections and their stored credentials.</li>
      <li>Your approval decisions and feedback on answers.</li>
      <li>Your devices and their push registrations.</li>
      <li>Your web and phone sign-in sessions.</li>
    </ul>
    <p><strong>On your organisation&rsquo;s agent.</strong></p>
    <ul>
      <li>Your chat history and the agent&rsquo;s memory of you.</li>
      <li>Files you uploaded, file versions and exports.</li>
      <li>Connected-app credentials and the agent&rsquo;s records of actions it took for you.</li>
      <li>The model-provider keys you added.</li>
      <li>If the agent serves only you, staff delete the whole server. If your organisation enabled backups, staff delete the copies on the server and the off-site ones.</li>
    </ul>
    <p><strong>Elsewhere.</strong> Disconnecting removes the credentials Sutur holds. It does not cancel access you granted at another service, for example Google or Microsoft. You can revoke that in the service&rsquo;s own security settings.</p>

    <h2>What is not removed, or not at once</h2>
    <Table head={['What', 'How long']} rows={[
      ['Database backups', <>Up to <strong>7 days</strong>, until they rotate out</>],
      ['Off-site backups of your organisation’s agent, if enabled', 'Up to 30 days, unless staff delete them earlier as above'],
      ['Sign-in security logs (the event, your IP address, a hash of your email, never the address itself)', <><strong>400 days</strong>, to protect the service against abuse</>],
      ['Sign-in throttle counters keyed by a hash of your email or username, and sign-out markers', 'They expire on their own'],
      ['The record that a phone was paired to lend files: its name (for example “Sam’s iPhone”) and public keys', 'Kept, marked as unpaired'],
      ['Content your organisation keeps in a shared workspace', 'Controlled by your organisation. Ask its administrator.'],
      ['What AI providers received while you used Rafic', <>Under each provider&rsquo;s own retention policy (see <Link href="/privacy">https://sutur.ai/privacy</Link>)</>],
      ['Data we must keep by law', 'Only as long as the law requires'],
    ]} />

    <h2>On your iPhone</h2>
    <ul>
      <li><strong>Sign out first</strong> if you can. Signing out deletes the app&rsquo;s sign-in keys, notification keys and website data on the phone.</li>
      <li><strong>Deleting the app</strong> removes its files, including the copies Rafic kept of files it changed in folders you lent. Your own files in those folders stay where they are.</li>
      <li><strong>iOS keeps an app&rsquo;s Keychain items after the app is deleted.</strong> Rafic keeps a small install marker there on purpose. If you were still signed in when you deleted the app, its keys also stay in the Keychain until you install Rafic again; the app then finds and deletes them. None of these items holds your messages or files, and none ever leaves the phone.</li>
    </ul>

    <h2>Questions</h2>
    <p><Mail /> · {COMPANY}, {ADDRESS}</p>
  </LegalPage>;
}
