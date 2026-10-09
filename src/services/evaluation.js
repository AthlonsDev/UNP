
export function eval_data(data){
    var criteria_list = 0



    if (data.languages.length === 1) {
        criteria_list += 1
    }
    else if (data.languages.length > 1 && (data.languages.length) <=3) {
        criteria_list += 2
    }
    else if (data.languages.length > 3) {
        criteria_list += 3
    }

    //  classify usability using AI - receive score from 1 to 3 here
    criteria_list += data.usability_easy_to_follow
    criteria_list += data.usability_clear_keypoints
    criteria_list += data.usability_non_expert_friendly

    //  classify engagement using AI - receive score from 1 to 3 here
    criteria_list += data.engagement

    // classify support using AI - receive score from 1 to 3 here
    criteria_list += data.support

    //  classify accreditation using AI as a boolean - receive 1 for True, 0 for False
    if (data.accreditation === true) {
        criteria_list += 1
    } else {
        criteria_list += 0
    }

    //  classify complementary using AI - receive score from 1 to 3 here
    criteria_list += data.complementary

    // classify unique using AI - receive score from 1 to 3 here
    criteria_list += data.unique
    // classify local_relevance using AI - receive score from 1 to 3 here
    criteria_list += data.local_relevance

    //  classify relevance using AI - receive score from 1 to 3 here
    criteria_list += data.relevance
    
    console.log("Evaluation Criteria Scores:", criteria_list)

    return criteria_list // return sum of all criteria scores

}