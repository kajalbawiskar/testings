import React from 'react'
import { Onboardingyear,Onboardingmonth, OnboardingBid, OnBoardingKeyword, Onboardingtopsac, OnboardingLocation, OnboardingCPA, OnboardingTopAudience } from './OnBoardingAudit/index'
// import OnboardingWeekover from './OnboardingWeekover'

const OnboardingAudit = () => {
  return (
    <>
    <OnboardingBid/>
    <Onboardingyear/>
    <Onboardingmonth/>
    <OnBoardingKeyword/>
    <OnboardingTopAudience/>
    <Onboardingtopsac/>
    <OnboardingLocation/>
    <OnboardingCPA/>
    {/* <OnboardingWeekover/> */}
    </>
  )
}

export default OnboardingAudit