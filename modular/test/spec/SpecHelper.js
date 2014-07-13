beforeEach(function () {
    stubToastr();

    function stubToastr(){
        spyOn(toastr, 'info').and.callFake(fakeToast);
        spyOn(toastr, 'error').and.callFake(fakeToast);
        spyOn(toastr, 'warning').and.callFake(fakeToast);
        spyOn(toastr, 'success').and.callFake(fakeToast);

        function fakeToast(msg){
            //console.log(msg);
        }
    }
});

var testctx = testctx || {};
testctx.getMockAvengers = function () {
    return [
        {
            "id": 1017109,
            "name": "Black Widow/Natasha Romanoff (MAA)",
            "description": "Natasha Romanoff, also known as Black Widow, is a world-renowned super spy and one of S.H.I.E.L.D.'s top agents. Her hand-to-hand combat skills, intelligence, and unpredictability make her a deadly secret weapon. True to her mysterious nature, Black Widow comes and goes as she pleases, but always appears exactly when her particular skills are needed.",
            "thumbnail": {
                "path": "http://i.annihil.us/u/prod/marvel/i/mg/a/03/523219743a99b",
                "extension": "jpg"
            }
        },
        {
            "id": 1017105,
            "name": "Captain America/Steve Rogers (MAA)",
            "description": "During World War II, Steve Rogers enlisted in the military and was injected with a super-serum that turned him into super-soldier Captain America! He's a skilled strategist and even more skilled with his shield, but it's his courage and good heart that makes Captain America both a leader and a true hero. ",
            "thumbnail": {
                "path": "http://i.annihil.us/u/prod/marvel/i/mg/3/10/52321928eaa72",
                "extension": "jpg"
            }
        },
        {
            "id": 1017110,
            "name": "Falcon/Sam Wilson (MAA)",
            "description": "Recruited from S.H.I.E.L.D. by his hero and mentor Tony Stark, Falcon is the Avengers' newest and youngest recruit. Like Tony, Sam is a genius with machines and technology. What he lacks in experience, Sam makes up in enthusiasm and determination. Falcon's suit of armor comes fully stocked with holographic wings, explosive flechettes, and retractable talons.",
            "thumbnail": {
                "path": "http://i.annihil.us/u/prod/marvel/i/mg/3/10/523219c347dd1",
                "extension": "jpg"
            }
        },
        {
            "id": 1017108,
            "name": "Hawkeye/Clint Barton (MAA)",
            "description": "Hawkeye is an expert archer with an attitude just as on-target as his aim. His stealth combat experience and his ability to hit any target with any projectile make him a valuable member of the Avengers. However, he refuses to let things get too serious, as he has as many jokes as he does arrows!",
            "thumbnail": {
                "path": "http://i.annihil.us/u/prod/marvel/i/mg/4/03/5232198a81c17",
                "extension": "jpg"
            }
        },
        {
            "id": 1017107,
            "name": "Hulk/Bruce Banner (MAA)",
            "description": "Scientist Bruce Banner was transformed into the Hulk as a result to gamma radiation exposure. Over 8 feet tall and weighing 1,040 pounds, it's Hulk's strength that makes him the strongest hero in the Marvel Universe! Hulk smashes all threats that dare disturb the peace and friendship he has found in the Avengers. ",
            "thumbnail": {
                "path": "http://i.annihil.us/u/prod/marvel/i/mg/0/03/523219b086a17",
                "extension": "jpg"
            }
        },
        {
            "id": 1017104,
            "name": "Iron Man/Tony Stark (MAA)",
            "description": "Tony Stark is the genius inventor/billionaire/philanthropist owner of Stark Industries. With his super high-tech Iron Man suit, he is practically indestructible, able to fly, and has a large selection of weapons to choose from - but it's Tony's quick thinking and ability to adapt and improvise that make him an effective leader of the Avengers.",
            "thumbnail": {
                "path": "http://i.annihil.us/u/prod/marvel/i/mg/2/d0/5232190d42df2",
                "extension": "jpg"
            }
        },
        {
            "id": 1017106,
            "name": "Thor (MAA)",
            "description": "Thor is the Asgardian Prince of Thunder, the son of Odin, and the realm's mightiest warrior. He loves the thrill of battle and is always eager to show off his power to the other Avengers, especially the Hulk. Thor's legendary Uru hammer, Mjolnir, gives him the power to control thunder and the ability to fly. He's found a new home on Earth and will defend it as his own... even if he doesn't understand its sayings and customs.",
            "thumbnail": {
                "path": "http://i.annihil.us/u/prod/marvel/i/mg/2/03/52321948a51f2",
                "extension": "jpg"
            }
        }
    ];
}

