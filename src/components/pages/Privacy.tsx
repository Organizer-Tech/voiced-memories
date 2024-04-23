import { Container } from '@/components/pages/Container'

  const privacy = [
    [
      {
        qPolicy: 'Do you share user audio or photos?',
        answer:
          'No, we respect our users’ privacy. We never share or distribute user content without explicit consent.',
      },
      {
        qPolicy: 'What measures are in place for data protection?',
        answer:
          'We use state-of-the-art encryption and secure servers. Your data’s security is our top priority.',
      },
    ],
    [
      {
        qPolicy: 'If I have any questions about privacy concern where can I get answers?',
        answer:
          'If you have any questions or concerns, please email: info@photocollections.ca',
      },
    ],
    [
      {
        qPolicy: 'What about third-party advertising and tracking?',
        answer:
          'We currently do not have any third-party ads, and do not track your usage of the site in anyway.',
      },
      {
        qPolicy: 'How can I delete my account and data?',
        answer:
          'Users can request account deletion from the settings. Upon confirmation, all data associated with the account will be permanently removed within a stipulated time frame.',
      },
    ],
  ]


export function Privacy() {
  return (
    <section
      id="privacy"
      aria-labelledby="privacy-title"
      className="border-t border-gray-200 py-20 sm:py-32 bg-cream"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="privacy-title"
            className="text-3xl font-medium tracking-tight text-gray-900"
          >
            Privacy Information
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            If you have anything else you want to ask,{' '}
            <a
              href="mailto:karen@photocollections.ca"
              className="text-gray-900 underline"
            >
              
              reach out to us
            </a>
            . If you wish to review our privacy policy,{' '}
            <a
              href="https://docs.google.com/document/d/18FTbBfp5_TlHCm0dmKVLTJ6Xe1XJk3fW2sfAsZfnM0E/edit"
              className="text-gray-900 underline"
            >
              
              click here
            </a>
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {privacy.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="space-y-10">
                {column.map((privacy, privacyIndex) => (
                  <li key={privacyIndex}>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      {privacy.qPolicy}
                    </h3>
                    <p className="mt-4 text-sm text-gray-700">{privacy.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
