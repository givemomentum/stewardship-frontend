<script setup lang="ts">
  const hooks = {
    layout: useLayoutControl(),
  };

  onMounted(async () => {
    hooks.layout.activateLeanMode();
  });

  useSeoMeta({
    title: "Privacy Policy",
    description: "Momentum Privacy Policy",
  });
</script>

<template>
  <CVStack w="100%" min-h="100vh">
    <PNavbar />
    <CBox p="10" max-w="800px">
      <h1>Privacy Policy</h1>

      <p>
        Welcome, and thank you for your interest in Momentum (“Momentum”, “we,” or “us”),
        our web site at
        <a href="https://givemomentum.com">https://givemomentum.com</a>
        (the “Site”), and all related web sites, downloadable software, mobile
        applications (including tablet applications), and other services provided by us
        and on which a link to this Privacy Policy is displayed, and all other
        communications with individuals though from written or oral means, such as email
        or phone (collectively, together with the Site, our “Service”).
      </p>

      <p>
        This Privacy Policy (“Policy”) describes the information that we gather on or
        through the Service, how we use and disclose such information, and the steps we
        take to protect such information. By visiting the Site, or by purchasing or using
        the Service, you accept the privacy practices described in this Policy.
      </p>

      <p>
        This Policy is incorporated into, and is subject to, the Momentum Terms of Use.
        Capitalized terms used but not defined in this Policy have the meaning given to
        them in the Momentum Terms of Use.
      </p>

      <h2>1. Definitions</h2>
      <dl>
        <dt>“Client”</dt>
        <dd>means a customer of Momentum.</dd>

        <dt>“Client Data“</dt>
        <dd>
          means personal data, reports, addresses, and other files, folders or documents
          in electronic form that a User of the Service stores within the Service.
        </dd>

        <dt>“Personal Data”</dt>
        <dd>
          means any information relating to an identified or identifiable natural person.
        </dd>

        <dt>“Public Area”</dt>
        <dd>
          means the area of the Site that can be accessed both by Users and Visitors,
          without needing to log in.
        </dd>

        <dt>“Restricted Area”</dt>
        <dd>
          means the area of the Site that can be accessed only by Users, and where access
          requires logging in.
        </dd>

        <dt>“User”</dt>
        <dd>
          means an employee, agent, or representative of a Client, who primarily uses the
          restricted areas of the Site for the purpose of accessing the Service in such
          capacity.
        </dd>

        <dt>“Visitor”</dt>
        <dd>
          means an individual other than a User, who uses the public area, but has no
          access to the restricted areas of the Site or Service.
        </dd>
      </dl>

      <h2>2. The Information We Collect on the Service:</h2>

      <p>
        We collect different types of information from or through the Service. The legal
        bases for Momentum’s processing of personal data are primarily that the processing
        is necessary for providing the Service in accordance with Momentum’s Terms of Use
        and that the processing is carried out in Momentum’s legitimate interests, which
        are further explained in the section “How We Use the Information We Collect” of
        this Policy. We may also process data upon your consent, asking for it as
        appropriate.
      </p>

      <h3>2.1 User-provided Information</h3>
      <p>
        When you use the Service, as a User or as a Visitor, you may provide, and we may
        collect Personal Data. Examples of Personal Data include name, email address,
        mailing address, mobile phone number, and credit card or other billing
        information. Personal Data also includes other information, such as geographic
        area or preferences, when any such information is linked to information that
        identifies a specific individual. You may provide us with Personal Data in various
        ways on the Service. For example, when you register for an Account, use the
        Service, post Client Data, interact with other users of the Service through
        communication or messaging capabilities, or send us customer service-related
        requests.
      </p>

      <h3>2.2 Information Collected by Clients</h3>
      <p>
        A Client or User may store or upload into the Service Client Data. Momentum has no
        direct relationship with the individuals whose Personal Data it hosts as part of
        Client Data. Each Client is responsible for providing notice to its customers and
        third persons concerning the purpose for which Client collects their Personal Data
        and how this Personal Data is processed in or through the Service as part of
        Client Data.
      </p>

      <h3>2.3 “Automatically Collected" Information</h3>
      <p>
        When a User or Visitor uses the Service, we may automatically record certain
        information from the User’s or Visitor’s device by using various types of
        technology, including cookies, “clear gifs" or “web beacons.” This “automatically
        collected" information may include IP address or other device address or ID, web
        browser and/or device type, the web pages or sites visited just before or just
        after using the Service, the pages or other content the User or Visitor views or
        interacts with on the Service, and the dates and times of the visit, access, or
        use of the Service. We also may use these technologies to collect information
        regarding a Visitor or User’s interaction with various forms of communication
        (including, without limitation, email messages, text messages and phone calls),
        such as whether the Visitor or User opens, clicks on, forwards or otherwise
        engages with a message. This information is gathered from all Users and Visitors.
      </p>

      <h3>2.4 Integrated Services</h3>
      <p>
        You may be given the option to access or register for the Service through the use
        of your user name and passwords for certain services provided by third parties
        (each, an “Integrated Service”), such as through the use of your Google account,
        or otherwise have the option to authorize an Integrated Service to provide
        Personal Data or other information to us. By authorizing us to connect with an
        Integrated Service, you authorize us to access and store your name, email
        address(es), date of birth, gender, current city, profile picture URL, and other
        information that the Integrated Service makes available to us, and to use and
        disclose it in accordance with this Policy. You should check your privacy settings
        on each Integrated Service to understand what information that Integrated Service
        makes available to us, and make changes as appropriate. Please review each
        Integrated Service’s terms of use and privacy policies carefully before using
        their services and connecting to our Service.
      </p>

      <h3>2.5 Information from Other Sources</h3>
      <p>
        We may obtain information, including Personal Data, from third parties and sources
        other than the Service, such as our partners, advertisers, credit rating agencies,
        and Integrated Services. If we combine or associate information from other sources
        with Personal Data that we collect through the Service, we will treat the combined
        information as Personal Data in accordance with this Policy.
      </p>

      <h3>2.6 Google OAuth Data Access</h3>
      <p>
        Our service uses Google OAuth to access your Gmail account with
        `gmail.readonly` and `gmail.compose` scopes. This allows us to read and
        send new emails from your address. We only use this access to track
        emails related to the donors in your portfolio and log these emails to
        your CRM automatically. We do not track or store any other emails that
        are not related to this function.
      </p>
      <p>
        Your email data accessed through Google OAuth is used exclusively for
        the purpose of improving your user experience and the functionality of
        our service.
      </p>

      <h2>3. How We Use the Information We Collect</h2>

      <p>
        We use the information that we collect in a variety of ways in providing the
        Service and operating our business, including the following:
      </p>

      <h3>3.1 Operations</h3>
      <p>
        We use the information to operate, maintain, enhance and provide all features of
        the Service, to provide the services and information that you request, to respond
        to comments and questions and to provide support to users of the Service.
      </p>

      <h2>3.2 Improvements</h2>
      <p>
        We use the information to understand and analyze the usage trends and preferences
        of our Visitors and Users, to improve the Service, and to develop new products,
        services, feature, and functionality. Should this purpose require Momentum to
        process Client Data, then the data will only be used in anonymized or aggregated
        form.
      </p>

      <h2>3.3 Communications</h2>
      <p>
        We may use a Visitor’s or User’s email address or other information to contact
        that Visitor or User (i) for administrative purposes such as customer service, to
        address intellectual property infringement, right of privacy violations or
        defamation issues related to the Client Data or Personal Data posted on the
        Service or (ii) with updates on promotions and events, relating to products and
        services offered by us and by third parties we work with. You have the ability to
        opt-out of receiving any promotional communications as described below under “Your
        Choices.”
      </p>

      <h2>3.4 Cookies and Tracking Technologies</h2>
      <p>
        We use automatically collected information and other information collected on the
        Service through cookies and similar technologies to: (i) personalize our Service,
        such as remembering a User’s or Visitor’s information so that the User or Visitor
        will not have to re-enter it during a visit or on subsequent visits; (ii) provide
        customized advertisements, content, and information; (iii) monitor and analyze the
        effectiveness of Service and third-party marketing activities; (iv) monitor
        aggregate site usage metrics such as total number of visitors and pages viewed;
        and (v) track your entries, submissions, and status in any promotions or other
        activities on the Service. You can obtain more information about cookies by
        visiting
        <a href="http://www.allaboutcookies.org">www.allaboutcookies.org</a>
        .
      </p>

      <h2>3.5 Analytics</h2>
      <p>
        We use several third-party service providers to measure and evaluate access to and
        traffic on the Public Area of the Site, and create user navigation reports for our
        Site administrators. We take commercially reasonable measures to protect the
        technical information collected by our use of these service providers. The data
        collected will only be used on a need to know basis to resolve technical issues,
        administer the Site and identify visitor preferences; but in this case, the data
        will be in non-identifiable form. We do not use any of this information to
        identify Visitors or Users.
      </p>

      <h2>4. To Whom We Disclose Information</h2>
      <p>
        Except as described in this Policy, we will not intentionally disclose the
        Personal Data or Client Data that we collect or store on the Service to third
        parties without the consent of the applicable Visitor, User or Client. We may
        disclose information to third parties if you consent to us doing so, as well as in
        the following circumstances:
      </p>

      <h3>4.1 Unrestricted Information</h3>
      <p>
        Any information that you voluntarily choose to include in a Public Area of the
        Service, such as a public profile page, will be available to any Visitor or User
        who has access to that content.
      </p>

      <h3>4.2 Other Users in Your Company Account</h3>
      <p>
        Certain information about your use of the Momentum Services is available to the
        administrator(s) of your Momentum Account and, depending on the settings chosen by
        the Users of the Account, also to other Users for the purposes of providing the
        Momentum Services.
      </p>

      <h3>4.3 Service Providers</h3>
      <p>
        We work with third party service providers who provide website, application
        development, hosting, maintenance, and other services for us. These third parties
        may have access to, or process Personal Data or Client Data as part of providing
        those services for us. We limit the information provided to these service
        providers to that which is reasonably necessary for them to perform their
        functions, and our contracts with them require them to maintain the
        confidentiality of such information.
      </p>

      <h3>4.4 Non Personally Identifiable Information</h3>
      <p>
        We may make certain automatically-collected, aggregated, or otherwise
        non-personally-identifiable information available to third parties for various
        purposes, including (i) compliance with various reporting obligations; (ii) for
        business or marketing purposes; or (iii) to assist such parties in understanding
        our Clients’, Users’ and Visitors’ interests, habits, and usage patterns for
        certain programs, content, services, and/or functionality available through the
        Service, all of the foregoing being subject to additional limits on use of your
        Google User data as stated in this Privacy Policy.
      </p>

      <h3>4.5 Law Enforcement, Legal Process and Compliance</h3>
      <p>
        We may disclose Personal Data or other information if required to do so by law or
        in the good-faith belief that such action is necessary to comply with applicable
        laws, in response to a facially valid court order, judicial or other government
        subpoena or warrant, or to otherwise cooperate with law enforcement or other
        governmental agencies. We also reserve the right to disclose Personal Data or
        other information that we believe, in good faith, is appropriate or necessary to
        (i) take precautions against liability, (ii) protect ourselves or others from
        fraudulent, abusive, or unlawful uses or activity, (iii) investigate and defend
        ourselves against any third-party claims or allegations, (iv) protect the security
        or integrity of the Service and any facilities or equipment used to make the
        Service available, or (v) protect our property or other legal rights, enforce our
        contracts, or protect the rights, property, or safety of others.
      </p>

      <h3>4.6 Change of Ownership</h3>
      <p>
        Information about Users and Visitors, including Personal Data, may be disclosed
        and otherwise transferred to an acquirer, successor or assignee as part of any
        merger, acquisition, debt financing, sale of assets, or similar transaction, as
        well as in the event of an insolvency, bankruptcy, or receivership in which
        information is transferred to one or more third parties as one of our business
        assets and only if the recipient of the User or Visitor Data commits to a Privacy
        Policy that has terms substantially consistent with this Privacy Policy. Client
        Data may be physically or electronically transferred to an acquirer, or successor
        or assignee as part of any merger, acquisition, debt financing, sale of assets, or
        similar transaction, as well as in the event of an insolvency, bankruptcy, or
        receivership in which information is transferred to one or more third parties as
        one of our business assets, for the sole purpose of continuing the operation of
        the Service, and only if the recipient of the Client Data commits to a Privacy
        Policy that has terms substantially consistent with this Privacy Policy.
      </p>

      <h2>5. Your Choices</h2>
      <h3>5.1 Access, Correction, Deletion</h3>
      <p>
        We respect your privacy rights and provide you with reasonable access to the
        Personal Data that you may have provided through your use of the Services. If you
        wish to access or amend any other Personal Data we hold about you, or to request
        that we delete or transfer any information about you that we have obtained from an
        Integrated Service, you may contact us as set forth in the “How to Contact Us”
        section. At your request, we will have any reference to you deleted or blocked in
        our database.
      </p>

      <p>
        You may update, correct, or delete your Account information and preferences at any
        time by accessing your Account settings page on the Service. Please note that
        while any changes you make will be reflected in active user databases instantly or
        within a reasonable period of time, we may retain all information you submit for
        backups, archiving, prevention of fraud and abuse, analytics, satisfaction of
        legal obligations, or where we otherwise reasonably believe that we have a
        legitimate reason to do so.
      </p>

      <p>
        You may decline to share certain Personal Data with us, in which case we may not
        be able to provide to you some of the features and functionality of the Service.
      </p>

      <p>
        At any time, you may object to the processing of your Personal Data, on legitimate
        grounds, except if otherwise permitted by applicable law. If you believe your
        right to privacy granted by applicable data protection laws has been infringed
        upon, please contact Momentum’s Data Protection Officer at
        victor@givemomentum.com. You also have a right to lodge a complaint with data
        protection authorities.
      </p>

      <p>
        This provision does not apply to Personal Data that is part of Client Data. In
        this case, the management of the Client Data is subject to the Client’s own
        Privacy Policy, and any request for access, correction or deletion should be made
        to the Client responsible for the uploading and storage of such data into the
        Service.
      </p>

      <h3>5.2 Navigation Information</h3>
      <p>
        You may opt out from the collection of navigation information about your visit to
        the Site by Google Analytics by using the Google Analytics Opt-out feature.
      </p>

      <h3>5.3 Opting out from Commercial Communications</h3>
      <p>
        If you receive commercial emails from us, you may unsubscribe at any time by
        following the instructions contained within the emails or by sending an email to
        the address provided in the “How to Contact Us” section.
      </p>

      <p>
        Please be aware that if you opt-out of receiving commercial email from us, it may
        take up to ten (10) business days for us to process your request. Additionally,
        even after you opt-out from receiving commercial messages from us, you will
        continue to receive administrative messages from us regarding the Service.
      </p>

      <p>
        Momentum has no direct relationship with the Client’s customers or third party
        whose Personal Data it may process on behalf of a Client. An individual who seeks
        access, or who seeks to correct, amend, delete inaccurate data or withdraw consent
        for further contact should direct his or her query to the Client or User they deal
        with directly. If the Client requests Momentum to remove the data, we will respond
        to its request within thirty (30) days. We will delete, amend or block access to
        any Personal Data that we are storing only if we receive a written request to do
        so from the Client who is responsible for such Personal Data, unless we have a
        legal right to retain such Personal Data. We reserve the right to retain a copy of
        such data for archiving purposes, or to defend our rights in litigation. Any such
        request regarding Client Data should be addressed as indicated in the “How to
        Contact Us” section, and include sufficient information for Momentum to identify
        the Client or its customer or third party and the information to delete or amend.
      </p>

      <h2>6. Third-Party Services</h2>
      <p>
        The Service may contain features or links to web sites and services provided by
        third parties. Any information you provide on third-party sites or services is
        provided directly to the operators of such services and is subject to those
        operators’ policies, if any, governing privacy and security, even if accessed
        through the Service. We are not responsible for the content or privacy and
        security practices and policies of third-party sites or services to which links or
        access are provided through the Service. We encourage you to learn about third
        parties’ privacy and security policies before providing them with information.
      </p>

      <h2>7. Your California Privacy Rights</h2>
      <p>
        We will not share any Personal Data with third-parties for their direct marketing
        purposes to the extent prohibited by California law. If our practices change, we
        will do so in accordance with applicable laws and will notify you in advance.
      </p>

      <h2>8. Do Not Track Policy</h2>
      <p>
        California law requires that operators of websites and online services disclose
        how they respond to a Do Not Track signal. Some browsers have incorporated “Do Not
        Track” features. Most of these features, when turned on, send a signal or
        preference to the website or online service that a user visits, indicating that
        the user does not wish to be tracked. Because there is not yet a common
        understanding of how to interpret Do Not Track signals, we do not currently
        respond to Do Not Track signal. We continue to work with the online industry to
        define a common understanding of how to treat Do Not Track signals.
      </p>
      <p>
        In the meantime, you may opt out of receiving interest based advertising from
        advertising networks that may be delivered on our platform and other websites by
        visiting the following websites. If you want to opt out of this online behavioral
        advertising, visit the following site:
        <a href="http://www.networkadvertising.org">www.networkadvertising.org</a>
        .
      </p>

      <p>
        This will opt you out of many – but not all - of the interest-based advertising
        activities in which we or third parties engage. Choices you make may be browser
        and device specific. If you delete your cookies or use a different browser or a
        different computer or device, you may need to update your opt-out choices. Other
        third-party Sites provide visitors with the ability to opt-out of receiving
        interest-based ads on their Sites that you need to control through your settings
        on that Site. For example, to opt out of Google’s use of your online behavior for
        advertising purposes, visit Google’s Ad Settings page.
      </p>

      <h2>9. Cookies</h2>
      <p>
        California law requires that operators of websites and online services disclose
        whether other third parties may collect personally identifiable information about
        an individual's online activities from their site or service. We allow third
        parties with which we have a separate agreement to use cookies and other
        technologies to collect information about your use of the Site. These third
        parties include (1) business partners, which collect information when you view or
        interact with one of their advertisements on the Site; and (2) advertising
        networks, which collect information about your interests when you view or interact
        with one of their advertisements.
      </p>
      <p>
        The information gathered by these third parties is used to make predictions about
        your interests or preferences so that they can display advertisements or
        promotional material on this Site and on other sites across the Internet tailored
        to your apparent interests.
      </p>

      <p>
        The business partners and advertising networks that serve interest-based
        advertisements on the Services have limited access to a small amount of
        information about your profile and your device, which is necessary to serve you
        advertisements that are tailored to your apparent interests. It is possible that
        they may reuse this small amount of information on other sites or services.
      </p>

      <p>
        We do not share with these third parties any information that would readily
        identify you (such as email address); however, these third parties may have access
        to information about your device (such as IP or MAC address). We do not have
        access to, or control over, the technologies that these third parties may use to
        collect information about your interests, and the information practices of these
        third parties are not covered by this Privacy Policy. Other than as discussed in
        this document, we have no control over these third parties.
      </p>

      <h2>10. Minors and Children’s Privacy</h2>
      <p>
        Protecting the privacy of young children is especially important. Our Service is
        not directed to children under the age of 18, and we do not knowingly collect
        Personal Data from children under the age of 18 without obtaining parental
        consent. If you are under 18 years of age, then please do not use or access the
        Service at any time or in any manner. If we learn that Personal Data has been
        collected on the Service from persons under 18 years of age and without verifiable
        parental consent, then we will take the appropriate steps to delete this
        information. If you are a parent or guardian and discover that your child under 18
        years of age has obtained an Account on the Service, then you may alert us at
        <a href="mailto:stewardship@givemomentum.com">stewardship@givemomentum.com</a>
        and request that we delete that child’s Personal Data from our systems.
      </p>

      <p>
        The Service is not intended to be used by minors, and is not intended to be used
        to post content to share publicly or with friends. To the extent that a minor has
        posted such content on the Service, the minor has the right to have this content
        deleted or removed using the deletion or removal options detailed in this Privacy
        Policy. If you have any question regarding this topic, please contact us as
        indicated in the “How to Contact Us” section. Please be aware that, although we
        offer this deletion capability, the removal of content may not ensure complete or
        comprehensive removal of that content or information.
      </p>

      <h2>11. Data Security</h2>
      <p>
        We follow generally accepted industry standards to protect the information
        submitted to us, both during transmission and once we receive it. We maintain
        appropriate administrative, technical and physical safeguards to protect Personal
        Data against accidental or unlawful destruction, accidental loss, unauthorized
        alteration, unauthorized disclosure or access, misuse, and any other unlawful form
        of processing of the Personal Data in our possession. This includes, for example,
        firewalls, password protection and other access and authentication controls.
      </p>
      <p>
        We use SSL technology to encrypt data during transmission through public internet,
        and we also employ application-layer security features to further anonymize
        Personal Data.
      </p>

      <p>
        Unfortunately, no method of transmission over the internet or method of electronic
        storage is 100% secure. Therefore, while we strive to use commercially acceptable
        means to protect your personal information, we cannot guarantee its absolute
        security.
      </p>

      <h2>12. Data Transfer</h2>

      <p>
        We may transfer, process and store Personal Data we collect through the Services
        in centralized databases and with service providers located in the U.S. The U.S.
        may not have the same data protection framework as the country from which you may
        be using the Services. When we transfer Personal Data to the U.S., we will protect
        it as described in this Privacy Policy.
      </p>

      <h2>13. Data Retention</h2>

      <p>
        We only retain the Personal Data collected from a User for as long as the User’s
        account is active or otherwise for a limited period of time as long as we need it
        to fulfill the purposes for which we have initially collected it, unless otherwise
        required by law.
      </p>

      <p>
        We will retain and use information as necessary to comply with our legal
        obligations, resolve disputes, and enforce our agreements as follows:
      </p>

      <ul>
        <li>
          the contents of closed accounts are deleted within 3 months of the date of
          closure;
        </li>
        <li>backups are kept for 3 months;</li>
        <li>
          billing information is retained for a period of 7 years as of their provision to
          Momentum in accordance with applicable accounting and taxation laws;
        </li>
        <li>
          information on legal transactions between Client and Momentum is retained for a
          period of 10 years as of their provision to Momentum in accordance with the
          general limitation period set for civil claims in accordance with applicable
          law.
        </li>
      </ul>

      <h2>14. Settings</h2>

      <p>
        Although we may allow you to adjust your privacy settings to limit access to
        certain Personal Data, please be aware that no security measures are perfect or
        impenetrable. We are not responsible for circumvention of any privacy settings or
        security measures on the Service. Additionally, we cannot control the actions of
        other users with whom you may choose to share your information. Further, even
        after information posted on the Service is removed, caching and archiving services
        may have saved that information, and other users or third parties may have copied
        or stored the information available on the Service. We cannot and do not guarantee
        that information you post on or transmit to the Service will not be viewed by
        unauthorized persons.
      </p>

      <h2>15. How to Contact Us</h2>

      <p>
        If you have any questions about this Privacy Policy or the Service, please contact
        us at
        <a href="mailto:victor@givemomentum.com">victor@givemomentum.com</a>
        or
        <a href="mailto:stewardship@givemomentum.com">stewardship@givemomentum.com</a>
        .
      </p>

      <h2>16. Changes and Updates to this Policy</h2>

      <p>
        Please revisit this page periodically to stay aware of any changes to this Policy,
        which we may update from time to time. If we modify the Policy, we will make it
        available through the Service, and indicate the date of the latest revision, and
        will comply with applicable law. Your continued use of the Service after the
        revised Policy has become effective indicates that you have read, understood and
        agreed to the current version of the Policy.
      </p>
    </CBox>
  </CVStack>
</template>

<style scoped>
  /* --------------------------------------------------------------

   typography.css
   * Sets up some sensible default typography.

-------------------------------------------------------------- */

  /* Default font settings.
   The font-size percentage is of 16px. (0.75 * 16px = 12px) */
  body {
    color: #222;
    background: #fff;
    font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
  }

  /* Headings
-------------------------------------------------------------- */

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: normal;
    color: #111;
  }

  h1 {
    font-size: 3em;
    line-height: 1;
    margin-bottom: 0.5em;
  }
  h2 {
    font-size: 2em;
    margin-bottom: 0.75em;
  }
  h3 {
    font-size: 1.5em;
    line-height: 1;
    margin-bottom: 1em;
  }
  h4 {
    font-size: 1.2em;
    line-height: 1.25;
    margin-bottom: 1.25em;
  }
  h5 {
    font-size: 1em;
    font-weight: bold;
    margin-bottom: 1.5em;
  }
  h6 {
    font-size: 1em;
    font-weight: bold;
  }

  h1 img,
  h2 img,
  h3 img,
  h4 img,
  h5 img,
  h6 img {
    margin: 0;
  }

  /* Text elements
-------------------------------------------------------------- */

  p {
    margin: 0 0 1.5em;
  }
  p img.left {
    float: left;
    margin: 1.5em 1.5em 1.5em 0;
    padding: 0;
  }
  p img.right {
    float: right;
    margin: 1.5em 0 1.5em 1.5em;
  }

  a:focus,
  a:hover {
    color: #000;
  }
  a {
    color: #009;
    text-decoration: underline;
  }

  blockquote {
    margin: 1.5em;
    color: #666;
    font-style: italic;
  }
  strong {
    font-weight: bold;
  }
  em,
  dfn {
    font-style: italic;
  }
  dfn {
    font-weight: bold;
  }
  sup,
  sub {
    line-height: 0;
  }

  abbr,
  acronym {
    border-bottom: 1px dotted #666;
  }
  address {
    margin: 0 0 1.5em;
    font-style: italic;
  }
  del {
    color: #666;
  }

  pre {
    margin: 1.5em 0;
    white-space: pre;
  }
  pre,
  code,
  tt {
    font:
      1em "andale mono",
      "lucida console",
      monospace;
    line-height: 1.5;
  }

  /* Lists
-------------------------------------------------------------- */

  li ul,
  li ol {
    margin: 0 1.5em;
  }
  ul,
  ol {
    margin: 0 1.5em 1.5em 1.5em;
  }

  ul {
    list-style-type: disc;
  }
  ol {
    list-style-type: decimal;
  }

  dl {
    margin: 0 0 1.5em 0;
  }
  dl dt {
    font-weight: bold;
  }
  dd {
    margin-left: 1.5em;
  }

  /* Tables
-------------------------------------------------------------- */

  table {
    margin-bottom: 1.4em;
    width: 100%;
  }
  th {
    font-weight: bold;
  }
  thead th {
    background: #c3d9ff;
  }
  th,
  td,
  caption {
    padding: 4px 10px 4px 5px;
  }
  tr.even td {
    background: #e5ecf9;
  }
  tfoot {
    font-style: italic;
  }
  caption {
    background: #eee;
  }

  /* Misc classes
-------------------------------------------------------------- */

  .small {
    font-size: 0.8em;
    margin-bottom: 1.875em;
    line-height: 1.875em;
  }
  .large {
    font-size: 1.2em;
    line-height: 2.5em;
    margin-bottom: 1.25em;
  }
  .hide {
    display: none;
  }

  .quiet {
    color: #666;
  }
  .loud {
    color: #000;
  }
  .highlight {
    background: #ff0;
  }
  .added {
    background: #060;
    color: #fff;
  }
  .removed {
    background: #900;
    color: #fff;
  }

  .first {
    margin-left: 0;
    padding-left: 0;
  }
  .last {
    margin-right: 0;
    padding-right: 0;
  }
  .top {
    margin-top: 0;
    padding-top: 0;
  }
  .bottom {
    margin-bottom: 0;
    padding-bottom: 0;
  }
</style>
